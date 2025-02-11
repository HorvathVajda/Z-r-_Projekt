<template>
  <div class="dashboard-content">
    <header>
      <h1>Vállalkozásaim</h1>
    </header>

    <div class="business-grid">
      <div v-for="(business, index) in businesses" :key="index" class="business-card" @click="selectBusiness(business)">
        <h3>{{ business.vallalkozas_neve }}</h3>
        <p>
          {{ business.iranyitoszam }} {{ business.varos }} {{ business.utca }} {{ business.hazszam }}
          <span v-if="business.ajto">{{ business.ajto }}</span>
        </p>
        <p>Kategória: {{ business.kategoria }}</p>
      </div>

      <div class="business-card add-business-card" @click="showForm = true">
        <span>+</span>
      </div>
    </div>

    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <form @submit.prevent="addBusiness">
          <h2>Új Vállalkozás Hozzáadása</h2>
          <div class="form-group" v-for="(value, key) in newBusiness" :key="key">
            <label :for="key">{{ fieldLabels[key] }}:</label>
            <input v-if="key !== 'category'" type="text" :id="key" v-model="newBusiness[key]" :required="key !== 'ajto'" />
            <select v-else id="category" v-model="newBusiness.category" required>
              <option value="" disabled selected>Válassz típust</option>
              <option value="Fodraszat">Fodrászat</option>
              <option value="Autoszerviz">Autószerviz</option>
              <option value="Fogaszat">Fogászat</option>
              <option value="Masszazs">Masszázs</option>
              <option value="Kozmetika">Kozmetikai szalon</option>
              <option value="Kutyakozmetika">Kutyakozmetika</option>
              <option value="SzemelyiEdzo">Személyi edző</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" class="submit-button">Hozzáadás</button>
            <button type="button" @click="showForm = false" class="cancel-button">Mégse</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="selectedBusiness" class="business-details">
      <h2>Szerkesztés</h2>
      <label>Név:</label>
      <input v-model="selectedBusiness.vallalkozas_neve" />
      <label>Kategória:</label>
      <input v-model="selectedBusiness.kategoria" />
      <label>Város:</label>
      <input v-model="selectedBusiness.varos" />
      <label>Utca:</label>
      <input v-model="selectedBusiness.utca" />
      <label>Házszám:</label>
      <input v-model="selectedBusiness.hazszam" />
      <label>Ajtó:</label>
      <input v-model="selectedBusiness.ajto" />
      <button @click="updateBusiness">Mentés</button>
      <button @click="selectedBusiness = null">Bezárás</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      businesses: [],
      selectedBusiness: null,
      showForm: false,
      newBusiness: {
        vallalkozas_neve: "",
        iranyitoszam: "",
        varos: "",
        utca: "",
        hazszam: "",
        ajto: "",
        category: "",
      },
      fieldLabels: {
        vallalkozas_neve: "Vállalkozás neve",
        iranyitoszam: "Irányítószám",
        varos: "Város",
        utca: "Utca",
        hazszam: "Házszám",
        ajto: "Ajtó (opcionális)",
        category: "Vállalkozás típusa",
      },
    };
  },
  mounted() {
    this.fetchBusinesses();
  },
  methods: {
    async fetchBusinesses() {
      try {
        const response = await axios.get('http://localhost:5000/api/businesses');
        this.businesses = response.data;
      } catch (error) {
        console.error('Hiba a vállalkozások betöltésekor:', error);
      }
    },
    selectBusiness(business) {
      this.selectedBusiness = { ...business };
    },
    async updateBusiness() {
      try {
        const updatedBusiness = {
          vallalkozas_neve: this.selectedBusiness.vallalkozas_neve,
          iranyitoszam: this.selectedBusiness.iranyitoszam,
          varos: this.selectedBusiness.varos,
          utca: this.selectedBusiness.utca,
          hazszam: this.selectedBusiness.hazszam,
          ajto: this.selectedBusiness.ajto,
          category: this.selectedBusiness.category,
          // helyszin újra generálása a frissített adatokból
          helyszin: `${this.selectedBusiness.iranyitoszam} ${this.selectedBusiness.varos} ${this.selectedBusiness.utca} ${this.selectedBusiness.hazszam}${this.selectedBusiness.ajto ? " " + this.selectedBusiness.ajto : ""}`
        };

        const response = await axios.put(
        `http://localhost:5000/api/businesses/update/${this.selectedBusiness.id}`, 
        updatedBusiness, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Token biztosítása
          }
        }
      );
        console.log('Frissítés sikeres:', response);
        this.fetchBusinesses(); // Frissítsd a vállalkozások listáját
        this.selectedBusiness = null; // Zárd be a szerkesztési formot
      } catch (error) {
        console.error('Hiba a vállalkozás frissítésekor:', error.response ? error.response.data : error.message);
      }
    },
    async addBusiness() {
      try {
        const response = await axios.post('http://localhost:5000/api/businesses/add', this.newBusiness, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Token hozzáadása
          }
        });
        this.businesses.push(response.data);
        this.showForm = false;
      } catch (error) {
        console.error('Hiba az új vállalkozás hozzáadásakor:', error);
      }
    },
  },
};
</script>


<style scoped>
.dashboard-content {
  padding: 20px;
}

.business-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.business-card {
  background-color: white;
  border: 1px solid #c3b1e1;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.business-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.add-business-card {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: #5a3472;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.add-business-card:hover {
  background-color: white;
  transform: scale(1.05);
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
  background: linear-gradient(to bottom right, #ffffff, #f3f1ff);
  padding: 2rem 3rem;
  border-radius: 15px;
  border: 2px solid #5a3472;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.form-container h2 {
  text-align: center;
  font-size: 22px;
  color: #5a3472;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 14px;
  color: #5a3472;
  text-align: left;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #c3b1e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: box-shadow 0.3s, border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  box-shadow: 0 0 8px rgba(138, 81, 189, 0.5);
  border-color: #5a3472;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
}

button {
  flex: 1;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin: 0 0.5rem;
}

.submit-button {
  background: #6327a2;
  color: white;
}

.submit-button:hover {
  transform: scale(1.05);
}

.cancel-button {
  background: white;
  border-color: #e74c3c;
  color: black;
}

.cancel-button:hover {
  background: white;
  transform: scale(1.05);
}
</style>
