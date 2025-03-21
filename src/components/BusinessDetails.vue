<template>
  <div class="business-details">
    <div v-if="business" class="business-card">
      <h1>{{ business.vallalkozas_neve }}</h1>
      <p><strong>Helyszín:</strong> {{ business.helyszin }}</p>
      <p><strong>Nyitvatartás:</strong> {{ business.nyitva_tartas }}</p>
      <p><strong>Kategória:</strong> {{ business.category }}</p>

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
          <button @click="deleteBusiness">Törlés</button>
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

const business = ref(null);
const services = ref([]);
const newService = ref({
  name: '',
  duration: '',
  price: ''
});
const route = useRoute();
const router = useRouter();
const isAddingService = ref(false);
const alertMessage = ref(null);

const fetchBusinessDetails = async () => {
  try {
    const response = await axios.get(`/api/businesses/vallalkozasok/${route.params.id}/details`);
    business.value = response.data;

    const servicesResponse = await axios.get(`/api/businesses/vallalkozasok/${route.params.id}/szolgaltatasok`);
    services.value = servicesResponse.data;
  } catch (error) {
    showAlert('Hiba a vállalkozás adatainak betöltésekor: ' + error.message);
  }
};

const addService = async () => {
  try {
    const response = await axios.post(`/api/businesses/vallalkozasok/${route.params.id}/szolgaltatasok`, {
      szolgaltatas_neve: newService.value.name,
      idotartam: newService.value.duration,
      ar: newService.value.price
    });

    services.value.push(response.data);
    newService.value.name = '';
    newService.value.duration = '';
    newService.value.price = '';
    isAddingService.value = false;
  } catch (error) {
    showAlert('Hiba a szolgáltatás hozzáadásakor: ' + error.message);
  }
};

const toggleAddServiceForm = () => {
  isAddingService.value = !isAddingService.value;
};

const deleteBusiness = async () => {
  try {
    const response = await axios.post(`/api/businesses/delete/${business.value.id}`);

    if (response.status === 200) {
      showAlert('Az üzlet sikeresen törölve.');

      // Visszairányítás 5 másodperc után
      setTimeout(() => {
        router.push('/vallalkozoHome');
      }, 5000);
    } else {
      showAlert('Hiba történt a törlés során');
    }
  } catch (error) {
    console.error('Hálózati hiba:', error);
    showAlert('Hálózati hiba történt');
  }
};

const addAvailableTime = async (service) => {
  if (service.selectedTime) {
    try {
      const availableTimeData = {
        szabad_ido: service.selectedTime,  // A választott időpontot ISO formátumban küldjük
        szolgaltatas_id: service.szolgaltatas_id
      };

      // Logoljuk a küldött adatokat a konzolra
      console.log(availableTimeData);

      if (availableTimeData.szabad_ido && availableTimeData.szolgaltatas_id) {
        const response = await axios.post(`/api/businesses/${business.value.id}/add-idopont`, availableTimeData);

        if (response.status === 200) {
          showAlert(`Szabad időpont hozzáadva: ${service.selectedTime}`);
          service.selectedTime = '';  // Kiürítjük a választott időpontot
        }
      } else {
        showAlert('Hibás adatok! Ellenőrizd a választott időpontot és szolgáltatást!');
      }
    } catch (error) {
      showAlert(`Hiba történt: ${error.response ? error.response.data.message : error.message}`);
    }
  } else {
    showAlert('Kérlek válassz egy időpontot!');
  }
};


const showAlert = (message) => {
  alertMessage.value = message;
  setTimeout(() => {
    alertMessage.value = null; // Hide message after 5 seconds
  }, 5000);
};

onMounted(fetchBusinessDetails);
</script>

<style scoped>
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
  background-color: #5a3472;
}

.available-times {
  margin-bottom: 10px;
}
.alert-box {
  position: fixed;
  bottom: 20px;  /* Set the box to the bottom */
  left: 20px;    /* Set the box to the left */
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
  background-color: #5a3472;
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
  background-color: #5a3472;
}

.button-container {
  display: flex;
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
</style>
