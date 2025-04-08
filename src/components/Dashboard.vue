<template>
  <div class="dashboard-container">
    <div class="header-section">
      <h1 class="page-title">Vállalkozásaim</h1>
      <p class="page-subtitle">Itt kezelheted vállalkozásaidat és adhatsz hozzá újat</p>
    </div>

    <div class="business-grid">
      <!-- Business cards -->
      <div v-for="business in businesses" :key="business.id" class="business-card">
        <div class="card-content">
          <div class="business-icon">
            <i class="fas fa-store"></i>
          </div>
          <h3 class="business-name">{{ business.vallalkozas_neve }}</h3>
          <p class="business-location">{{ business.helyszin }}</p>
          <div class="card-footer">
            <router-link :to="'/vallalkozoHome/ceg/' + business.id" class="business-link">
              <button class="action-button primary">
                <i class="fas fa-arrow-right"></i> Megnyitás
              </button>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Add new business card -->
      <div class="business-card add-new" @click="showForm = true">
        <div class="card-content">
          <div class="add-icon">
            <i class="fas fa-plus"></i>
          </div>
          <h3>Új vállalkozás</h3>
          <p>Kattints ide egy új vállalkozás hozzáadásához</p>
        </div>
      </div>
    </div>

    <!-- Add Business Modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Új Vállalkozás</h2>
          <button class="close-button" @click="showForm = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="submitBusinessForm" class="business-form">
          <div class="form-group">
            <label for="businessName">Vállalkozás neve</label>
            <input type="text" id="businessName" v-model="newBusiness.vallalkozas_neve" required
                   placeholder="Add meg a vállalkozás nevét" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="postalCode">Irányítószám</label>
              <input type="text" id="postalCode" v-model="newBusiness.iranyitoszam"
                     @input="validatePostalCode(); findCity()" required
                     placeholder="1234" maxlength="4" />
            </div>

            <div class="form-group">
              <label for="city">Város</label>
              <input type="text" id="city" v-model="newBusiness.varos" readonly
                     placeholder="Automatikusan kitöltődik" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="street">Utca</label>
              <input type="text" id="street" v-model="newBusiness.utca" required
                     placeholder="Példa utca" />
            </div>

            <div class="form-group">
              <label for="houseNumber">Házszám</label>
              <input type="text" id="houseNumber" v-model="newBusiness.hazszam" required
                     placeholder="12" />
            </div>
          </div>

          <div class="form-group">
            <label for="openingHours">Nyitvatartás</label>
            <div class="input-with-icon">
              <i class="fas fa-clock"></i>
              <input type="text" id="openingHours" v-model="newBusiness.nyitva_tartas"
                     required placeholder="08:00-16:00" maxlength="11"
                     @input="formatOpeningHours" />
            </div>
          </div>

          <div class="form-group">
            <label for="category">Kategória</label>
            <div class="input-with-icon">
              <i class="fas fa-tag"></i>
              <input type="text" id="category" v-model="newBusiness.category"
                     placeholder="Pl. étterem, fodrász" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="action-button secondary" @click="showForm = false">
              Mégse
            </button>
            <button type="submit" class="action-button primary">
              <i class="fas fa-save"></i> Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Papa from 'papaparse';
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const businesses = ref([]);
const showForm = ref(false);
const newBusiness = ref({
  vallalkozas_neve: '',
  iranyitoszam: '',
  varos: '',
  utca: '',
  hazszam: '',
  nyitva_tartas: '',
  category: ''
});
const locations = ref([]);

// Vállalkozások betöltése
const fetchBusinesses = async () => {
  try {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData || !authData.id) {
      console.error('Hiányzó felhasználói adatok');
      return;
    }
    const response = await axios.get('/api/businesses/vallalkozasok', {
      params: { vallalkozo_id: authData.id }
    });
    businesses.value = response.data;
  } catch (error) {
    console.error('Hiba a vállalkozások betöltésekor:', error);
  }
};

const loadLocations = async () => {
  try {
    await Papa.parse('/data/IrszHnk.csv', {
      download: true,
      complete: (result) => {
        locations.value = result.data.map(item => {
          const postalCode = item[1]?.trim();
          const city = item[0]?.trim();
          if (postalCode && city) {
            return { postalCode, city };
          }
        }).filter(location => location);
      }
    });
  } catch (error) {
    console.error('Hiba a CSV fájl betöltésekor:', error);
  }
};

const validatePostalCode = () => {
  if (newBusiness.value.iranyitoszam) {
    newBusiness.value.iranyitoszam = newBusiness.value.iranyitoszam.replace(/[^0-9]/g, '');
    if (newBusiness.value.iranyitoszam.length > 4) {
      newBusiness.value.iranyitoszam = newBusiness.value.iranyitoszam.slice(0, 4);
    }
  }
};

const findCity = () => {
  const foundLocation = locations.value.find(location => location.postalCode === newBusiness.value.iranyitoszam);
  newBusiness.value.varos = foundLocation ? foundLocation.city : '';
};

const formatOpeningHours = () => {
  let value = newBusiness.value.nyitva_tartas.replace(/[^0-9:-]/g, '');
  if (/^\d{2}$/.test(value)) value += ':';
  if (/^\d{2}:\d{2}$/.test(value)) value += '-';
  if (/^\d{2}:\d{2}-\d{2}$/.test(value)) value += ':';
  if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(value) && value.length > 11) {
    value = value.substring(0, 11);
  }
  newBusiness.value.nyitva_tartas = value;
};

const submitBusinessForm = async () => {
  try {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData || !authData.id) {
      console.error('Hiányzó felhasználói adatok');
      return;
    }
    const helyszin = `${newBusiness.value.iranyitoszam} ${newBusiness.value.varos}, ${newBusiness.value.utca} ${newBusiness.value.hazszam}`;
    const businessData = {
      vallalkozas_neve: newBusiness.value.vallalkozas_neve,
      helyszin: helyszin,
      nyitva_tartas: newBusiness.value.nyitva_tartas,
      category: newBusiness.value.category,
      vallalkozo_id: authData.id
    };

    await axios.post('/api/businesses/vallalkozasokHozzaadasa', businessData);
    showForm.value = false;
    newBusiness.value = {
      vallalkozas_neve: '',
      iranyitoszam: '',
      varos: '',
      utca: '',
      hazszam: '',
      nyitva_tartas: '',
      category: ''
    };
    await fetchBusinesses();
  } catch (error) {
    console.error('Hiba a vállalkozás hozzáadásakor:', error);
  }
};

onMounted(async () => {
  await fetchBusinesses();
  await loadLocations();
});
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
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  font-family: 'Poppins', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: black;
  background-color: transparent;
  min-height: 100vh;
  margin-top: 50px;
}

.header-section {
  margin-bottom: 2.5rem;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--light-text);
  font-weight: 400;
}

.business-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.business-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.business-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.business-card.add-new {
  background-color: rgba(108, 92, 231, 0.05);
  border: 2px dashed var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.business-card.add-new:hover {
  background-color: rgba(108, 92, 231, 0.1);
}

.card-content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.business-icon {
  width: 60px;
  height: 60px;
  background-color: rgba(108, 92, 231, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.add-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  color: var(--primary-color);
  font-size: 2rem;
}

.business-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.business-location {
  font-size: 0.95rem;
  color: var(--light-text);
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.card-footer {
  margin-top: auto;
}

.action-button {
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

.action-button i {
  font-size: 0.9rem;
}

.action-button.primary {
  background-color: var(--primary-color);
  color: black;
  width: 100%;
  justify-content: center;
}

.action-button.primary:hover {
  background-color: var(--primary-hover);
}

.action-button.secondary {
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.action-button.secondary:hover {
  background-color: rgba(108, 92, 231, 0.05);
}

.business-link {
  text-decoration: none;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--light-text);
  cursor: pointer;
  transition: var(--transition);
}

.close-button:hover {
  color: var(--text-color);
}

.business-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  transition: var(--transition);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
}

.form-group input[readonly] {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--light-text);
}

.input-with-icon input {
  padding-left: 2.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .business-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .modal-container {
    width: 95%;
  }
}
</style>