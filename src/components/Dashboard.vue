<template>
  <div class="dashboard-content">
    <header>
      <h1>Vállalkozásaim</h1>
    </header>

    <div class="business-grid">
      <div v-for="(business, index) in businesses" :key="index" class="business-card">
        {{ business.name }}
      </div>
      <div class="business-card add-business-card" @click="showForm = true">
        <span>+</span>
      </div>
    </div>

    <!-- Új vállalkozás űrlap -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <form @submit.prevent="addBusiness">
          <h2>Új Vállalkozás Hozzáadása</h2>
          <div class="form-group">
            <label for="name">Vállalkozás neve:</label>
            <input type="text" id="name" v-model="newBusiness.name" required />
          </div>
          <div class="form-group">
            <label for="category">Kategória:</label>
            <select id="category" v-model="newBusiness.category" required>
              <option value="" disabled selected>Válassz kategóriát</option>
              <option value="Fodraszat">Fodrászat</option>
              <option value="Autoszerviz">Autószerviz</option>
              <option value="Fogaszat">Fogászat</option>
              <option value="Masszazs">Masszázs</option>
              <option value="Kozmetika">Kozmetikai szalon</option>
              <option value="Kutyakozmetika">Kutyakozmetika</option>
              <option value="">Személyi edző</option>
            </select>
          </div>
          <div class="form-group">
            <label for="description">Leírás:</label>
            <textarea id="description" v-model="newBusiness.description"></textarea>
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
export default {
  name: "Dashboard",
  data() {
    return {
      showForm: false,
      newBusiness: {
        name: "",
        category: "",
        description: "",
      },
      businesses: []
    };
  },
  methods: {
    addBusiness() {
      if (this.newBusiness.name && this.newBusiness.category) {
        this.businesses.push({ ...this.newBusiness });
        this.newBusiness = { name: "", category: "", description: "" };
        this.showForm = false;
      } else {
        alert("Kérlek, töltsd ki az összes mezőt!");
      }
    }
  }
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
  border: 1px solid #C3B1E1;
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
  color: #5A3472;
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
  background: #6327A2;
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
