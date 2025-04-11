<template>
  <div class="business-details-container">
    <!-- Floating background elements -->
    <div class="floating-dots">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
      <div class="dot dot-3"></div>
    </div>

    <div v-if="business" class="business-card-wrapper">
      <div class="business-header">
        <h1 class="business-title">{{ business.vallalkozas_neve }}</h1>
        <div class="business-meta">
          <div class="meta-item">
            <span class="meta-icon"><i class="fas fa-compass"></i></span>
            <span class="meta-text">{{ business.helyszin }}</span>
            <button @click="toggleEdit('location')" class="meta-edit-btn">
              {{ isEditing.location ? 'Mégse' : 'Szerkesztés' }}
            </button>
          </div>

          <div class="meta-item">
            <span class="meta-icon"><i class="fas fa-clock"></i></span>
            <span class="meta-text">{{ business.nyitva_tartas }}</span>
            <button @click="toggleEdit('hours')" class="meta-edit-btn">
              {{ isEditing.hours ? 'Mégse' : 'Szerkesztés' }}
            </button>
          </div>

          <div class="meta-item">
            <span class="meta-icon"><i class="fas fa-building"></i></span>
            <span class="meta-text">{{ business.category }}</span>
            <button @click="toggleEdit('category')" class="meta-edit-btn">
              {{ isEditing.category ? 'Mégse' : 'Szerkesztés' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Edit forms -->
      <div v-if="isEditing.location" class="edit-form">
        <input type="text" v-model="newBusinessLocation" class="edit-input" placeholder="Új helyszín" />
        <button @click="saveField('location')" class="action-btn save-btn">Mentés</button>
      </div>

      <div v-if="isEditing.hours" class="edit-form">
        <input type="text" v-model="newBusinessHours" class="edit-input" placeholder="08:00-16:00" />
        <button @click="saveField('hours')" class="action-btn save-btn">Mentés</button>
      </div>

      <div v-if="isEditing.category" class="edit-form">
        <input type="text" v-model="newBusinessCategory" class="edit-input" placeholder="Új kategória" />
        <button @click="saveField('category')" class="action-btn save-btn">Mentés</button>
      </div>

      <!-- Services section -->
      <div class="services-section">
        <h2 class="section-title">Szolgáltatások</h2>
        <div class="services-grid">
          <div class="service-card" v-for="service in services" :key="service.szolgaltatas_id">
            <div class="service-icon">
              <i class="fas fa-lightbulb"></i>
            </div>
            <h3 class="service-name">{{ service.szolgaltatas_neve }}</h3>
            <div class="service-details">
              <div class="detail-item">
                <span class="detail-icon"><i class="fas fa-money-bill-wave"></i></span>
                <span class="detail-value">{{ service.ar }} Ft</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon"><i class="fas fa-clock"></i></span>
                <span class="detail-value">{{ service.idotartam }} perc</span>
              </div>
            </div>

            <div class="time-selection">
              <label :for="'availableTime' + service.szolgaltatas_id">Új időpont:</label>
              <input type="datetime-local" v-model="service.selectedTime" :id="'availableTime' + service.szolgaltatas_id" class="time-input" />
              <button @click="addAvailableTime(service)" class="action-btn add-time-btn">
                <i class="fas fa-plus"></i> Hozzáadás
              </button>
            </div>
          </div>
        </div>

        <!-- Add service button -->
        <button @click="toggleAddServiceForm" class="add-service-btn">
          <i class="fas fa-plus"></i> Új szolgáltatás
        </button>
      </div>

      <!-- Add service form -->
      <div v-if="isAddingService" class="add-service-form">
        <h3 class="form-title">Új szolgáltatás hozzáadása</h3>
        <form @submit.prevent="addService" class="service-form">
          <div class="form-group">
            <label for="serviceName">Szolgáltatás neve</label>
            <input type="text" id="serviceName" v-model="newService.name" required class="form-input" />
          </div>
          <div class="form-group">
            <label for="serviceDuration">Időtartam (perc)</label>
            <input type="number" id="serviceDuration" v-model="newService.duration" required class="form-input" />
          </div>
          <div class="form-group">
            <label for="servicePrice">Ár (Ft)</label>
            <input type="number" id="servicePrice" v-model="newService.price" required class="form-input" />
          </div>
          <div class="form-actions">
            <button type="button" @click="toggleAddServiceForm" class="action-btn cancel-btn">Mégse</button>
            <button type="submit" class="action-btn submit-btn">Mentés</button>
          </div>
        </form>
      </div>

      <!-- Action buttons -->
      <div class="action-buttons">
        <router-link to="/vallalkozoHome" class="back-link">
          <button class="action-btn back-btn">
            <i class="bi bi-chevron-left"></i> Vissza
          </button>
        </router-link>
        <button @click="deleteBusiness" class="action-btn delete-btn">
          <i class="fas fa-trash-alt"></i> Vállalkozás törlése
        </button>
      </div>
    </div>

    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
      <p>Betöltés...</p>
    </div>

    <!-- Alert message -->
    <div v-if="alertMessage" class="alert-box" :class="{ 'error': alertMessage.includes('Hiba') }">
      <p>{{ alertMessage }}</p>
      <button @click="alertMessage = null" class="close-alert"><i class="fas fa-window-close"></i></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const business = ref(null);
const services = ref([]);
const isEditing = ref({
  location: false,
  hours: false,
  category: false
});
const newBusinessLocation = ref('');
const newBusinessHours = ref('');
const newBusinessCategory = ref('');
const isAddingService = ref(false);
const newService = ref({
  name: '',
  duration: '',
  price: ''
});
const alertMessage = ref(null);

const route = useRoute();
const router = useRouter();

const fetchBusinessDetails = async () => {
  try {
    const response = await axios.get(`/api/businesses/vallalkozasok/${route.params.id}/details`);
    business.value = response.data;
    newBusinessLocation.value = business.value.helyszin;
    newBusinessHours.value = business.value.nyitva_tartas;
    newBusinessCategory.value = business.value.category;

    const servicesResponse = await axios.get(`/api/businesses/vallalkozasok/${route.params.id}/szolgaltatasok`);
    services.value = servicesResponse.data.map(service => ({
      ...service,
      selectedTime: ''
    }));
  } catch (error) {
    showAlert('Hiba a vállalkozás adatainak betöltésekor: ' + error.message);
  }
};

const toggleEdit = (field) => {
  isEditing.value[field] = !isEditing.value[field];
  if (!isEditing.value[field]) {
    cancelEdit(field);
  }
};

const cancelEdit = (field) => {
  switch (field) {
    case 'location':
      newBusinessLocation.value = business.value.helyszin;
      break;
    case 'hours':
      newBusinessHours.value = business.value.nyitva_tartas;
      break;
    case 'category':
      newBusinessCategory.value = business.value.category;
      break;
  }
};

const saveField = async (field) => {
  const updatedBusiness = {
    ...business.value,
    helyszin: newBusinessLocation.value,
    nyitva_tartas: newBusinessHours.value,
    category: newBusinessCategory.value
  };

  try {
    const response = await axios.put(`/api/businesses/vallalkozasok/${business.value.id}`, updatedBusiness);
    business.value = response.data;
    isEditing.value[field] = false;
    showAlert('Sikeresen frissítve!');
  } catch (error) {
    showAlert('Hiba történt a frissítés során: ' + error.message);
  }
};

const toggleAddServiceForm = () => {
  isAddingService.value = !isAddingService.value;
  if (!isAddingService.value) {
    newService.value = { name: '', duration: '', price: '' };
  }
};

const addService = async () => {
  try {
    const response = await axios.post('/api/businesses/szolgaltatasok', {
      ...newService.value,
      vallalkozas_id: business.value.id
    });
    services.value.push({ ...response.data, selectedTime: '' });
    toggleAddServiceForm();
    showAlert('Szolgáltatás sikeresen hozzáadva!');
  } catch (error) {
    showAlert('Hiba a szolgáltatás hozzáadásakor: ' + error.message);
  }
};

const addAvailableTime = async (service) => {
  if (!service.selectedTime) {
    showAlert('Válassz időpontot!');
    return;
  }

  try {
    // Feltételezve, hogy az üzlet ID-ja a 'service.businessId' változóban van
    const businessId = service.businessId;

    await axios.post(`/api/businesses/${businessId}/add-idopont`, {
      szabad_ido: service.selectedTime,
      szolgaltatas_id: service.szolgaltatas_id
    });

    showAlert('Időpont sikeresen hozzáadva!');
    service.selectedTime = '';  // Reset selected time after successful add
  } catch (error) {
    showAlert('Hiba az időpont hozzáadásakor: ' + error.message);
  }
};

const deleteBusiness = async () => {
  if (!confirm('Biztosan törölni szeretnéd ezt a vállalkozást?')) return;

  try {
    await axios.delete(`/api/businesses/vallalkozasok/${business.value.id}`);
    router.push('/vallalkozoHome');
  } catch (error) {
    showAlert('Hiba a vállalkozás törlésekor: ' + error.message);
  }
};

const showAlert = (message) => {
  alertMessage.value = message;
  setTimeout(() => {
    alertMessage.value = null;
  }, 5000);
};

onMounted(fetchBusinessDetails);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

:root {
  --primary-color: #6c5ce7;
  --primary-hover: #5649c0;
  --secondary-color: #a29bfe;
  --accent-color: #00cec9;
  --text-color: #2d3436;
  --light-text: #636e72;
  --bg-color: #f5f6fa;
  --card-bg: #ffffff;
  --border-color: #dfe6e9;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s ease;
  --success-color: #27ae60;
  --error-color: #e74c3c;
  --warning-color: #f39c12;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.business-details-container {
  font-family: 'Poppins', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 50px;
  padding: 2rem;
  color: var(--text-color);
  position: relative;
  min-height: 100vh;
}

/* Floating dots background */
.floating-dots {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.dot {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  will-change: transform;
  animation: randomFloat 30s infinite ease-in-out alternate;
}

/* Egyedi elhelyezések */
.dot-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #c7aaff 0%, rgba(255,182,193,0) 70%);
  top: 10%;
  left: 20%;
  animation-duration: 35s;
}

.dot-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #ffb6c1 0%, rgba(255,182,193,0) 70%);
  top: 60%;
  left: 10%;
  animation-duration: 40s;
}

.dot-3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #dda0dd 0%, rgba(221,160,221,0) 70%);
  top: 30%;
  right: 15%;
  animation-duration: 50s;
}

/* Random mozgás keyframes – akár több variáció is lehet */
@keyframes randomFloat {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  20% {
    transform: translate(60px, -40px) scale(1.1) rotate(15deg);
  }
  40% {
    transform: translate(-40px, 60px) scale(0.9) rotate(-10deg);
  }
  60% {
    transform: translate(50px, 50px) scale(1.05) rotate(5deg);
  }
  80% {
    transform: translate(-30px, -30px) scale(0.95) rotate(-20deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
}


/* Business header */
.business-header {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.business-title {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.business-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
}

.meta-icon {
  color: var(--primary-color);
  width: 24px;
  text-align: center;
}

.meta-text {
  flex: 1;
  color: var(--light-text);
}

.meta-edit-btn {
  background-color: black;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.meta-edit-btn:hover {
  background-color: black;
  transform: translateY(-2px);
}

/* Edit forms */
.edit-form {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  gap: 1rem;
  align-items: center;
}

.edit-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  transition: var(--transition);
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.3); /* halvány árnyék mindig */
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.4); /* erősebb fókusz árnyék */
}


/* Services section */
.services-section {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.service-card {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.service-icon {
  width: 50px;
  height: 50px;
  background-color: rgba(108, 92, 231, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.service-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.service-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.detail-icon {
  color: var(--primary-color);
  width: 20px;
}

.detail-value {
  color: var(--light-text);
}

.time-selection {
  margin-top: 1.5rem;
}

.time-selection label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--light-text);
}

.time-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 0.8rem;
}

/* Action buttons */
.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn i {
  font-size: 0.9rem;
}

.save-btn {
  background-color: var(--primary-color);
  color: white;
}

.save-btn:hover {
  background-color: var(--primary-hover);
}

.add-time-btn {
  background-color: var(--accent-color);
  color: white;
  background-color: black;
  width: 100%;
  justify-content: center;
}

.add-service-btn {
  background-color: black;
  color: white;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: var(--transition);
  border: none;
  cursor: pointer;
}

.add-service-btn:hover {
  background-color: black;
  transform: translateY(-2px);
}

/* Add service form */
.add-service-form {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.form-title {
  background-color: var(--primary-color);
  font-size: 1.3rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.service-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.95rem;
  color: var(--light-text);
}

.form-input {
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  transition: var(--transition);
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.3); /* halvány árnyék mindig */
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.4); /* halvány árnyék mindig */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn {
  background-color: var(--primary-color);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.cancel-btn:hover {
  background-color: rgba(108, 92, 231, 0.2);
}

.submit-btn {
  background-color: rgba(108, 92, 231, 0.3);
  color: black;
}

.submit-btn:hover {
  background-color: rgba(108, 92, 231, 0.6);
}

/* Action buttons at bottom */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.back-btn {
  background-color: black;
  color: white;
  border: 1px solid var(--primary-color);
}

.back-btn:hover {
  background-color: black;
}

.delete-btn {
  background-color: #c0392b;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(108, 92, 231, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alert box */
.alert-box {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 90%;
  animation: slideIn 0.3s ease-out;
}

.alert-box.error {
  background-color: var(--error-color);
}

.alert-box p {
  margin: 0;
}

.close-alert {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, 100%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .business-details-container {
    padding: 1.5rem;
  }

  .business-header, .services-section, .add-service-form {
    padding: 1.5rem;
  }

  .business-title {
    font-size: 1.5rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .edit-form {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .back-btn, .delete-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .business-details-container {
    padding: 1rem;
  }

  .business-header, .services-section, .add-service-form {
    padding: 1rem;
  }

  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .meta-edit-btn {
    align-self: flex-end;
  }
}
</style>