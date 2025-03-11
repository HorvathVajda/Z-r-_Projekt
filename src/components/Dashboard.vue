<template>
  <div class="dashboard-content">
    <div>
      <h1>Vállalkozásaim</h1>
      <div class="business-cards">
        <!-- Display businesses as cards -->
        <div v-for="business in businesses" :key="business.id" class="business-card">
          <h3>{{ business.vallalkozas_neve }}</h3>
          <p>{{ business.helyszin }}</p>
          <router-link :to="'/vallalkozoHome/ceg/' + business.id" class="business-link">
            <button class="go-to-business-btn">Tovább a vállalkozásra</button>
          </router-link>
        </div>

        <!-- Plus card to add a new business -->
        <div class="add-business-card" @click="showForm = true">
          <span class="plus-icon">+</span>
          <p>Új vállalkozás hozzáadása</p>
        </div>
      </div>
    </div>

    <!-- Form modal for adding a new business -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <h2>Új Vállalkozás</h2>
        <form @submit.prevent="submitBusinessForm">
          <div class="form-group">
            <label for="businessName">Vállalkozás neve</label>
            <input type="text" id="businessName" v-model="newBusiness.vallalkozas_neve" required />
          </div>
          <div class="form-group">
            <label for="postalCode">Irányítószám</label>
            <input type="text" id="postalCode" v-model="newBusiness.iranyitoszam" @input="validatePostalCode" required />
          </div>
          <div class="form-group">
            <label for="city">Város</label>
            <input type="text" id="city" v-model="newBusiness.varos" required />
          </div>
          <div class="form-group">
            <label for="street">Utca</label>
            <input type="text" id="street" v-model="newBusiness.utca" required />
          </div>
          <div class="form-group">
            <label for="houseNumber">Házszám</label>
            <input type="text" id="houseNumber" v-model="newBusiness.hazszam" required />
          </div>
          <div class="form-group">
            <label for="openingHours">Nyitvatartás (HH:MM-HH:MM)</label>
            <input
              type="text"
              id="openingHours"
              v-model="newBusiness.nyitva_tartas"
              required
              placeholder="00:00-00:00"
              maxlength="11"
              @input="formatOpeningHours"
            />
          </div>
          <div class="form-group">
            <label for="category">Kategória</label>
            <input type="text" id="category" v-model="newBusiness.category" />
          </div>
          <div class="form-buttons">
            <button type="submit" class="submit-button">Mentés</button>
            <button type="button" class="cancel-button" @click="showForm = false">Mégse</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

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

const validatePostalCode = () => {
  if (newBusiness.value.iranyitoszam) {
    // Csak számokat engedünk be
    newBusiness.value.iranyitoszam = newBusiness.value.iranyitoszam.replace(/[^0-9]/g, '');

    // Ha több mint 4 számjegy van, levágjuk
    if (newBusiness.value.iranyitoszam.length > 4) {
      newBusiness.value.iranyitoszam = newBusiness.value.iranyitoszam.slice(0, 4);
    }
  }
};

// Nyitvatartás formázása (HH:MM-HH:MM formátumban)
const formatOpeningHours = (event) => {
  let value = event.target.value;

  // Csak számokat és ":" karaktert engedünk
  value = value.replace(/[^0-9:]/g, '');

  // Első két szám után helyezzük el a ":" karaktert, ha nem létezik
  if (value.length > 2 && value[2] !== ':') {
    value = value.substring(0, 2) + ':' + value.substring(2);
  }

  // A "-" karaktert a 5. pozícióra rakjuk, ha már 5 karakter van
  if (value.length > 5 && value[5] !== '-') {
    value = value.substring(0, 5) + '-' + value.substring(5);
  }

  // A második ":" karaktert a 8. pozícióra rakjuk
  if (value.length > 8 && value[8] !== ':') {
    value = value.substring(0, 8) + ':' + value.substring(8);
  }

  // Csak 11 karakter lehet (HH:MM-HH:MM formátum)
  if (value.length > 11) {
    value = value.substring(0, 11);
  }

  // Ellenőrzés, hogy az órák és percek érvényesek-e (00-24, 00-59)
  const parts = value.split(':');
  if (parts.length === 2) {
    const openingHour = parseInt(parts[0], 10);
    const openingMinute = parseInt(parts[1].slice(0, 2), 10);

    // Ellenőrizzük, hogy az első óra és perc érvényes-e
    if (openingHour > 24) {
      value = '24:' + value.slice(3);
    }
    if (openingMinute > 59) {
      value = value.slice(0, 3) + '59' + value.slice(5);
    }

    // Második időpont (zárás)
    if (parts[1].includes('-')) {
      const closingHour = parseInt(parts[1].split('-')[1].slice(0, 2), 10);
      const closingMinute = parseInt(parts[1].split('-')[1].slice(3, 5), 10);

      // Ha a záró óra nagyobb, mint 24, akkor állítsuk be 24-re
      if (closingHour > 24) {
        value = value.slice(0, 6) + '24' + value.slice(8);
      }

      // Ha a záró perc nagyobb, mint 59, akkor állítsuk be 59-re
      if (closingMinute > 59) {
        value = value.slice(0, 8) + '59';
      }
    }
  }

  event.target.value = value;
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

    console.log('Business data being sent:', businessData); // Log the data being sent

    const response = await axios.post('/api/businesses/vallalkozasokHozzaadasa', businessData);

    console.log('Vállalkozás hozzáadva:', response.data);
    businesses.value.push(response.data); // Add the new business to the list
    showForm.value = false; // Hide the form
  } catch (error) {
    console.error('Hiba a vállalkozás hozzáadásakor:', error);
  }
};


onMounted(fetchBusinesses);
</script>

<style scoped>
.go-to-business-btn {
  background-color: #6327a2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.go-to-business-btn:hover {
  background-color: #5a3472;
}
html, body {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  padding: 20px;
  flex-grow: 1;
  overflow: auto;
}

.business-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.business-card, .add-business-card{
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.business-card h3 {
  font-size: 18px;
  color: #6327a2;
  margin-bottom: 10px;
}

.business-card p {
  font-size: 14px;
  color: #666;
}

.add-business-btn {
  display: block;
  width: 100%;
  background: #6327a2;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}

.plus-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
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

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.submit-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button {
  background-color: #6327a2;
  color: white;
}

.cancel-button {
  background-color: #ddd;
}

.submit-button:hover {
  background-color: #5a3472;
}

.cancel-button:hover {
  background-color: #bbb;
}
</style>
