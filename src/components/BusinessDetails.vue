<template>
  <div class="business-details">
    <div v-if="business" class="business-card">
      <h1>{{ business.vallalkozas_neve }}
        <button @click="toggleEdit('name')" :class="{'cancel-button': isEditing.name, 'edit-button': !isEditing.name}">
          {{ isEditing.name ? 'Mégse' : 'Szerkesztés' }}
        </button>
      </h1>
      <p><strong>Helyszín:</strong> {{ business.helyszin }}
        <button @click="toggleEdit('location')" :class="{'cancel-button': isEditing.location, 'edit-button': !isEditing.location}">
          {{ isEditing.location ? 'Mégse' : 'Szerkesztés' }}
        </button>
      </p>
      <p><strong>Nyitvatartás:</strong> {{ business.nyitva_tartas }}
        <button @click="toggleEdit('hours')" :class="{'cancel-button': isEditing.hours, 'edit-button': !isEditing.hours}">
          {{ isEditing.hours ? 'Mégse' : 'Szerkesztés' }}
        </button>
      </p>
      <p><strong>Kategória:</strong> {{ business.category }}
        <button @click="toggleEdit('category')" :class="{'cancel-button': isEditing.category, 'edit-button': !isEditing.category}">
          {{ isEditing.category ? 'Mégse' : 'Szerkesztés' }}
        </button>
      </p>

      <!-- Edit form for each field -->
      <div v-if="isEditing.name" class="edit-form">
        <input type="text" v-model="newBusinessName" class="edit-input" />
        <button @click="saveField('name')" class="save-button">Mentés</button>
      </div>
      <div v-if="isEditing.location" class="edit-form">
        <input type="text" v-model="newBusinessLocation" class="edit-input" />
        <button @click="saveField('location')" class="save-button">Mentés</button>
      </div>
      <div v-if="isEditing.hours" class="edit-form">
        <input type="text" v-model="newBusinessHours" class="edit-input" />
        <button @click="saveField('hours')" class="save-button">Mentés</button>
      </div>
      <div v-if="isEditing.category" class="edit-form">
        <input type="text" v-model="newBusinessCategory" class="edit-input" />
        <button @click="saveField('category')" class="save-button">Mentés</button>
      </div>

      <!-- Szolgáltatások kártyákban -->
      <h2>Szolgáltatások</h2>
      <div class="service-cards">
        <div class="service-card" v-for="service in services" :key="service.szolgaltatas_id">
          <div class="service-card-content">
            <h3>{{ service.szolgaltatas_neve }}</h3>
            <p><strong>Ár:</strong> {{ service.ar }} Ft</p>
            <p><strong>Időtartam:</strong> {{ service.idotartam }} perc</p>

            <!-- Dátum és időpont választó -->
            <div class="available-times">
              <label :for="'availableTime' + service.szolgaltatas_id">Szabad időpontok hozzáadása:</label>
              <input type="datetime-local" v-model="service.selectedTime" :id="'availableTime' + service.szolgaltatas_id" />
            </div>

            <!-- Hozzáadás gomb -->
            <button @click="addAvailableTime(service)" class="add-time-button">Hozzáadás</button>
          </div>
        </div>
      </div>

      <!-- Plusz jel a szolgáltatás hozzáadásához -->
      <div class="add-service-btn" @click="toggleAddServiceForm">
        <span class="plus-sign">+</span>
      </div>

      <!-- Szolgáltatás hozzáadása űrlap -->
      <div v-if="isAddingService" class="add-service-form">
        <h3>Szolgáltatás hozzáadása</h3>
        <form @submit.prevent="addService">
          <div class="form-group">
            <label for="serviceName">Szolgáltatás neve</label>
            <input type="text" id="serviceName" v-model="newService.name" required />
          </div>
          <div class="form-group">
            <label for="serviceDuration">Időtartam (perc)</label>
            <input type="number" id="serviceDuration" v-model="newService.duration" required />
          </div>
          <div class="form-group">
            <label for="servicePrice">Ár (Ft)</label>
            <input type="number" id="servicePrice" v-model="newService.price" required />
          </div>
          <button type="submit" class="submit-button">Hozzáadás</button>
        </form>
      </div>

      <!-- Back and Delete buttons -->
      <div class="button-container">
        <div class="back-button">
          <router-link to="/vallalkozoHome">
            <button class="go-back-btn">Vissza a vállalkozásokhoz</button>
          </router-link>
        </div>
        <div class="delete-button">
          <button @click="deleteBusiness(); refresh()">Törlés</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Betöltés...</p>
    </div>

    <!-- Error/Info Box -->
    <div v-if="alertMessage" class="alert-box">
      <p>{{ alertMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

// Az alap adatokat tároló változók
const business = ref(null);
const services = ref([]);

// A szerkesztéshez szükséges változók
const isEditing = ref({
  name: false,
  location: false,
  hours: false,
  category: false
});

const newBusinessName = ref('');
const newBusinessLocation = ref('');
const newBusinessHours = ref('');
const newBusinessCategory = ref('');

// Route és Router
const route = useRoute();
const router = useRouter();

// Alert üzenet megjelenítése
const alertMessage = ref(null);

const fetchBusinessDetails = async () => {
  try {
    const response = await axios.get(`/api/businesses/vallalkozasok/${route.params.id}/details`);
    business.value = response.data;
    newBusinessName.value = business.value.vallalkozas_neve;
    newBusinessLocation.value = business.value.helyszin;
    newBusinessHours.value = business.value.nyitva_tartas;
    newBusinessCategory.value = business.value.category;

    const servicesResponse = await axios.get(`/api/businesses/vallalkozasok/${route.params.id}/szolgaltatasok`);
    services.value = servicesResponse.data;
  } catch (error) {
    showAlert('Hiba a vállalkozás adatainak betöltésekor: ' + error.message);
  }
};

// Toggle the edit form visibility
const toggleEdit = async (field) => {
  isEditing.value[field] = !isEditing.value[field];
  // Ha a felhasználó "Mégse"-re kattint, akkor visszaállítjuk a mező értékét
  if (!isEditing.value[field]) {
    cancelEdit(field);
  }
};

// Visszaállítja az eredeti értéket, ha a felhasználó nem menti a változtatásokat
const cancelEdit = (field) => {
  switch (field) {
    case 'name':
      newBusinessName.value = business.value.vallalkozas_neve;
      break;
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

// Az új SQL lekérdezés meghívása a backendről
const saveField = async (field) => {
  const updatedBusiness = {
    vallalkozas_neve: newBusinessName.value,
    helyszin: newBusinessLocation.value,
    nyitva_tartas: newBusinessHours.value,
    category: newBusinessCategory.value
  };

  try {
    // SQL lekérdezés meghívása
    const response = await axios.put(`/api/businesses/vallalkozasok/${business.value.id}`, updatedBusiness);

    if (response.status === 200) {
      // Ha a lekérdezés sikeres, frissíti az adatokat
      business.value = response.data;
      isEditing.value[field] = false;
      showAlert('Sikeresen frissítve!');
    }
  } catch (error) {
    showAlert('Hiba történt a frissítés során: ' + error.message);
  }
};

// Alert üzenet megjelenítése
const showAlert = (message) => {
  alertMessage.value = message;
};

onMounted(fetchBusinessDetails);
</script>


<style scoped>
h1, p {
  line-height: 1.6;
  font-size: 18px;
  margin-bottom: 10px;
}

.edit-button {
  background-color: #6327a2;
  color: white;
  padding: 6px 14px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-left: 10px;
}

.cancel-button {
  background-color: #e74c3c;
  color: white;
  padding: 6px 14px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.edit-button:hover, .cancel-button:hover {
  transform: scale(1.05);
}

.edit-button:hover {
  background-color: #9d9ff4;
}

.cancel-button:hover {
  background-color: rgb(231, 77, 60, 0.8);
}

.edit-form {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
}

/* Edit input mezők szélességének optimalizálása */
.edit-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;  /* Teljes szélesség mobilon */
  transition: border-color 0.3s ease;
}

.edit-input:focus {
  border-color: #6327a2;
  outline: none;
}

.save-button {
  background-color: #6327a2;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.save-button:hover {
  background-color: #9d9ff4;
  transform: scale(1.05);
}

.add-time-button {
  background-color: #6327a2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.add-time-button:hover {
  background-color: #9d9ff4;
}

.available-times {
  margin-bottom: 10px;
}

.alert-box {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: #ffcc00;
  color: black;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.business-details {
  padding: 20px;
}

.business-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.business-card h1 {
  font-size: 24px;
  color: #6327a2;
  margin-bottom: 10px;
}

.business-card p {
  font-size: 16px;
  color: #666;
  margin: 5px 0;
}

.service-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.service-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.service-card h3 {
  font-size: 18px;
  color: #6327a2;
}

.service-card p {
  font-size: 14px;
  color: #666;
}

.add-service-btn {
  background-color: #6327a2;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 30px;
  position: relative;
  top: 20px;
}

.plus-sign {
  font-size: 30px;
}

.add-service-form {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  background-color: #6327a2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #9d9ff4;
}

.go-back-btn {
  background-color: #6327a2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.go-back-btn:hover {
  background-color: #9d9ff4;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.delete-button button {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button button:hover {
  background-color: darkred;
}

@media screen and (max-width: 768px) {
  h1, p {
    font-size: 16px;
  }

  .edit-input {
    font-size: 14px;
    padding: 8px;
  }

  /* Edit form: Kisebb képernyőkön a mezők teljes szélességben */
  .edit-form {
    gap: 15px;
  }

  .service-card {
    width: 100%;
    margin-bottom: 15px;
  }

  .add-service-btn {
    font-size: 25px;
    width: 45px;
    height: 45px;
  }

  .business-card {
    padding: 15px;
  }

  .button-container {
    flex-direction: column;
    gap: 8px;
  }

  /* Gombok mobilon jobban igazodjanak */
  .save-button, .cancel-button, .edit-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
}
</style>