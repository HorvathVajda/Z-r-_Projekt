<template>
  <div class="dashboard-content">
    <header>
      <h1>Vállalkozásaim</h1>
    </header>

    <div class="business-grid">
      <div
        v-for="(business, index) in businesses"
        :key="index"
        class="business-card"
        :class="{ selected: selectedBusiness && selectedBusiness.id === business.id, expanded: isExpanded }"
        @click="selectBusiness(business)"
      >
        <h3>{{ business.vallalkozas_neve }}</h3>
        <p>
          {{ business.iranyitoszam }} {{ business.varos }} {{ business.utca }} {{ business.hazszam }}
          <span v-if="business.ajto">{{ business.ajto }}</span>
        </p>
        <p>Kategória: {{ business.kategoria }}</p>
        
        <!-- Szerkesztés és Törlés gombok -->
        <div class="business-card-actions">
          <button @click="editBusiness(business)">Szerkesztés</button>
          <button @click="deleteBusiness(business.id)">Törlés</button>
        </div>
      </div>

      <div class="business-card add-business-card" @click="showForm = true">
        <span>+</span>
      </div>
    </div>

    <div v-if="isExpanded" class="overlay" @click="closeExpandedView">
      <div class="expanded-business">
        <h2>{{ selectedBusiness.vallalkozas_neve }}</h2>
        <p>{{ selectedBusiness.iranyitoszam }} {{ selectedBusiness.varos }}, {{ selectedBusiness.utca }} {{ selectedBusiness.hazszam }}</p>
        <p>Kategória: {{ selectedBusiness.kategoria }}</p>
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
      this.selectedBusiness = business;
      this.isExpanded = true;
    },
    closeExpandedView() {
      this.isExpanded = false;
      this.selectedBusiness = null;
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
        const authData = JSON.parse(localStorage.getItem('authData'));
        const token = authData ? authData.token : null;

        if (!token) {
          console.error('Token is missing');
          return;
        }

        // A helyszín összeállítása
        this.newBusiness.helyszin = `${this.newBusiness.iranyitoszam} ${this.newBusiness.varos} ${this.newBusiness.utca} ${this.newBusiness.hazszam}${this.newBusiness.ajto ? " " + this.newBusiness.ajto : ""}`;

        const response = await axios.post('http://localhost:5000/api/businesses/add', this.newBusiness, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.businesses.push(response.data);
        this.showForm = false;
      } catch (error) {
        console.error('Hiba az új vállalkozás hozzáadásakor:', error);
      }
    },

    // Új funkcionalitás a vállalkozás szerkesztéséhez
    editBusiness(business) {
      this.selectedBusiness = { ...business };
      this.showForm = true;
    },

    // Törlés funkcionalitás hozzáadása
    async deleteBusiness(businessId) {
      try {
        await axios.delete(`http://localhost:5000/api/businesses/delete/${businessId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Token biztosítása
          }
        });
        this.fetchBusinesses(); // Frissítjük a vállalkozások listáját
      } catch (error) {
        console.error('Hiba a vállalkozás törlésénél:', error);
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
  cursor: pointer;
}

.business-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.business-card.selected {
  border: 2px solid #5a3472;
  box-shadow: 0 6px 15px rgba(90, 52, 114, 0.5);
  background-color: #f3f1ff;
}

.business-card-actions {
  margin-top: 10px;
}

.business-card-actions button {
  margin: 5px;
  padding: 8px 15px;
  background-color: #6327a2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.business-card-actions button:hover {
  background-color: #5a3472;
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
}

.form-container {
  background-color: white;
  padding: 30px;
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

.form-group input,
.form-group select {
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.expanded-business {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
}

.expanded-business h2 {
  margin-bottom: 15px;
}

.expanded-business p {
  margin: 10px 0;
}
</style>
