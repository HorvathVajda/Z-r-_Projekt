<template>
  <div class="dashboard-content">
    <header>
      <h1>Vállalkozásaim</h1>
    </header>

    <button @click="fetchBusinesses">Vállalkozások betöltése</button>

    <div v-if="businesses.length > 0" class="business-grid">
      <div
        v-for="business in businesses"
        :key="business.vallalkozas_id"
        class="business-card"
        :class="{ selected: selectedBusiness && selectedBusiness.vallalkozas_id === business.vallalkozas_id }"
        @click="selectBusiness(business)"
      >
        <h3>{{ business.vallalkozas_neve }}</h3>

        <p>
          {{ business.iranyitoszam }} {{ business.varos }},
          {{ business.utca }} {{ business.hazszam }}
        </p>

        <p>Kategória: {{ business.category }}</p>

        <div class="business-card-actions">
          <button @click.stop="openEditForm(business)">Szerkesztés</button>
        </div>
      </div>

      <div class="business-card add-business-card" @click="openNewForm">
        <span>+</span>
      </div>
    </div>

    <div v-else>
      <p>Még nincs betöltve egyetlen vállalkozás sem.</p>
    </div>

    <div v-if="selectedBusiness" class="overlay" @click="closeExpandedView">
      <div class="expanded-business">
        <h2>{{ selectedBusiness.vallalkozas_neve }}</h2>
        <p>
          {{ selectedBusiness.iranyitoszam }} {{ selectedBusiness.varos }},
          {{ selectedBusiness.utca }} {{ selectedBusiness.hazszam }}
        </p>
        <p>Kategória: {{ selectedBusiness.category }}</p>
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
      categories: [],
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
  },
  methods: {
    async fetchBusinesses() {
  try {
    const authData = JSON.parse(localStorage.getItem('authData'));
    const email = authData?.email;
    if (!email) {
      console.error('Nincs bejelentkezett felhasználó email cím!');
      return;
    }

    const response = await axios.get(`/api/businesses/vallalkozo_vallalkozasai`, {
      params: { email },
      timeout: 10000  // Time-out növelése, hogy több idő legyen a válaszra
    });

    console.log('Válasz adat:', response.data);

    if (response.data && Array.isArray(response.data)) {
      this.businesses = response.data;
    } else {
      console.error('Nem megfelelő formátumú válasz!');
    }
  } catch (error) {
    console.error('Hiba a vállalkozások betöltésekor:', error);
    if (error.response) {
      console.error('Backend válasz:', error.response.data);
    } else if (error.request) {
      console.error('A kérés nem érkezett meg a backendhez:', error.request);
    } else {
      console.error('Hiba a kérés küldése közben:', error.message);
    }
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

        const response = await axios.put(`api/businesses/update/${this.selectedBusiness.id}`, updatedBusiness);
        console.log('Frissítés sikeres:', response);
        this.fetchBusinesses();
        this.closeForm();
      } catch (error) {
        console.error('Hiba a vállalkozás frissítésekor:', error.response ? error.response.data : error.message);
      }
    },
    async addBusiness() {
      try {
        if (this.showCustomCategoryInput && this.customCategory.trim() !== "") {
          this.newBusiness.category = this.customCategory;
        }
        if (!this.newBusiness.vallalkozas_neve || !this.newBusiness.iranyitoszam ||
            !this.newBusiness.varos || !this.newBusiness.utca || !this.newBusiness.hazszam ||
            !this.newBusiness.category) {
          console.error('Minden mezőt ki kell tölteni!');
          return;
        }
        this.newBusiness.helyszin = `${this.newBusiness.iranyitoszam} ${this.newBusiness.varos} ${this.newBusiness.utca} ${this.newBusiness.hazszam}${this.newBusiness.ajto ? " " + this.newBusiness.ajto : ""}`;

        const response = await axios.post('/api/businesses/add', this.newBusiness);
        if (response.data) {
          this.businesses.push(response.data);
        }
        this.closeForm();
        this.fetchBusinesses();
      } catch (error) {
        console.error('Hiba az új vállalkozás hozzáadásakor:', error.response ? error.response.data : error.message);
      }
    },

    openEditForm(business) {
      this.selectedBusiness = { ...business };
      this.isEdit = true;
      this.showForm = true;
    },

    openNewForm() {
      this.showForm = true;
      this.isEdit = false;
      this.newBusiness = {
        vallalkozas_neve: "",
        iranyitoszam: "",
        varos: "",
        utca: "",
        hazszam: "",
        ajto: "",
        category: ""
      };
    },

    closeForm() {
      this.showForm = false;
      this.isEdit = false;
      this.customCategory = "";
    },

    closeExpandedView() {
      this.selectedBusiness = null;
    },

    selectBusiness(business) {
      this.selectedBusiness = this.selectedBusiness === business ? null : business;
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
