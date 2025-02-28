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

        <div class="business-card-actions">
          <button @click.stop="openEditForm(business)">Szerkesztés</button>
          <button @click.stop="deleteBusiness(business.id)">Törlés</button>
        </div>
      </div>

      <div class="business-card add-business-card" @click="openNewForm">
        <span>+</span>
      </div>
    </div>

    <div v-if="isExpanded" class="overlay" @click="closeExpandedView">
      <div class="expanded-business">
        <h2>{{ selectedBusiness.vallalkozas_neve }}</h2>
        <p>
          {{ selectedBusiness.iranyitoszam }} {{ selectedBusiness.varos }},
          {{ selectedBusiness.utca }} {{ selectedBusiness.hazszam }}
        </p>
        <p>Kategória: {{ selectedBusiness.kategoria }}</p>
      </div>
    </div>

    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <form @submit.prevent="isEdit ? updateBusiness() : addBusiness()">
          <h2>{{ isEdit ? 'Vállalkozás Szerkesztése' : 'Új Vállalkozás Hozzáadása' }}</h2>
          <div class="form-group">
            <label for="vallalkozas_neve">Vállalkozás neve:</label>
            <input type="text" id="vallalkozas_neve" v-model="activeBusiness.vallalkozas_neve" required />
          </div>
          <div class="form-group">
            <label for="iranyitoszam">Irányítószám:</label>
            <input type="text" id="iranyitoszam" v-model="activeBusiness.iranyitoszam" required />
          </div>
          <div class="form-group">
            <label for="varos">Város:</label>
            <input type="text" id="varos" v-model="activeBusiness.varos" required />
          </div>
          <div class="form-group">
            <label for="utca">Utca:</label>
            <input type="text" id="utca" v-model="activeBusiness.utca" required />
          </div>
          <div class="form-group">
            <label for="hazszam">Házszám:</label>
            <input type="text" id="hazszam" v-model="activeBusiness.hazszam" required />
          </div>
          <div class="form-group">
            <label for="ajto">Ajtó (opcionális):</label>
            <input type="text" id="ajto" v-model="activeBusiness.ajto" />
          </div>
          <div class="form-group">
            <label for="category">Vállalkozás típusa:</label>
            <select id="category" v-model="activeBusiness.category" required @change="handleCategoryChange">
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              <option value="other">Más...</option>
            </select>
            <input
              v-if="showCustomCategoryInput"
              type="text"
              v-model="customCategory"
              placeholder="Írd be az új vállalkozás típust"
            />
          </div>
          <div class="form-buttons">
            <button type="submit" class="submit-button">
              {{ isEdit ? 'Szerkesztés' : 'Hozzáadás' }}
            </button>
            <button type="button" @click="closeForm" class="cancel-button">
              Mégse
            </button>
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
      categories: [], // új változó a kategóriák tárolására
      selectedBusiness: null,
      showForm: false,
      isEdit: false,
      newBusiness: {
        vallalkozas_neve: "",
        iranyitoszam: "",
        varos: "",
        utca: "",
        hazszam: "",
        ajto: "",
        category: ""
      },
      customCategory: "",
      showCustomCategoryInput: false,
      fieldLabels: {
        vallalkozas_neve: "Vállalkozás neve",
        iranyitoszam: "Irányítószám",
        varos: "Város",
        utca: "Utca",
        hazszam: "Házszám",
        ajto: "Ajtó (opcionális)",
        category: "Vállalkozás típusa"
      }
    };
  },
  computed: {
    activeBusiness: {
      get() {
        return this.isEdit ? this.selectedBusiness : this.newBusiness;
      },
      set(val) {
        if (this.isEdit) {
          this.selectedBusiness = val;
        } else {
          this.newBusiness = val;
        }
      }
    }
  },
  mounted() {
    this.fetchBusinesses();
    this.fetchCategories(); // Kategóriák betöltése
  },
  methods: {
    async fetchBusinesses() {
      try {
        const userEmail = JSON.parse(localStorage.getItem('authData')).email;
        const response = await axios.get('/api/businesses/vallalkozo_vallalkozasai', {
          headers: {
            'email': userEmail
          }
        });
        this.businesses = response.data;
      } catch (error) {
        console.error('Hiba a vállalkozások betöltésekor:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('/api/businesses/categories'); // Kategóriák lekérése
        this.categories = response.data;
      } catch (error) {
        console.error('Hiba a kategóriák betöltésekor:', error);
      }
    },
    handleCategoryChange() {
      if (this.activeBusiness.category === "other") {
        this.showCustomCategoryInput = true;
        this.customCategory = "";
      } else {
        this.showCustomCategoryInput = false;
      }
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
          helyszin: `${this.selectedBusiness.iranyitoszam} ${this.selectedBusiness.varos} ${this.selectedBusiness.utca} ${this.selectedBusiness.hazszam}${this.selectedBusiness.ajto ? " " + this.selectedBusiness.ajto : ""}`
        };
        const response = await axios.put(`http://localhost:5000/api/businesses/update/${this.selectedBusiness.id}`, updatedBusiness);
        console.log('Frissítés sikeres:', response);
        this.fetchBusinesses();
        this.closeForm();
      } catch (error) {
        console.error('Hiba a vállalkozás frissítésekor:', error.response ? error.response.data : error.message);
      }
    },
    async addBusiness() {
      try {
        if (this.showCustomCategoryInput) {
          this.newBusiness.category = this.customCategory;
        }
        this.newBusiness.helyszin = `${this.newBusiness.iranyitoszam} ${this.newBusiness.varos} ${this.newBusiness.utca} ${this.newBusiness.hazszam}${this.newBusiness.ajto ? " " + this.newBusiness.ajto : ""}`;
        const response = await axios.post('http://localhost:5000/api/businesses/add', this.newBusiness);
        this.businesses.push(response.data);
        this.closeForm();
      } catch (error) {
        console.error('Hiba az új vállalkozás hozzáadásakor:', error);
      }
    },
    async deleteBusiness(businessId) {
      try {
        await axios.delete(`http://localhost:5000/api/businesses/delete/${businessId}`);
        this.fetchBusinesses();
      } catch (error) {
        console.error('Hiba a vállalkozás törlésénél:', error);
      }
    },
    openEditForm(business) {
      this.selectedBusiness = { ...business };
      this.showForm = true;
      this.isEdit = true;
    },
    closeForm() {
      this.showForm = false;
      this.isEdit = false;
      this.selectedBusiness = null;
    },
    openNewForm() {
      this.showForm = true;
      this.isEdit = false;
    }
  }
};
</script>


<style scoped>
html, body {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-content {
  padding: 20px;
  flex-grow: 1;
  overflow: auto; /* Ha a tartalom túllépi a képernyő magasságát, görgethető lesz */
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

.add-business-btn:hover {
  background: #5a3472;
}

.form-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.form-container {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

button {
  background-color: #6327a2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #5a3472;
}

/* Fix a footer és az űrlap közötti problémát */
footer {
  position: relative;
  background-color: #6327a2;
  color: white;
  padding: 10px 0;
  text-align: center;
  width: 100%;
}

</style>
