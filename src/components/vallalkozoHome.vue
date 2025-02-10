<template>
  <div class="dashboard-container">
    <!-- Oldalsáv -->
    <aside class="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><router-link to="/vallalkozoHome/beallitasok">Beállítások</router-link></li>
        <li><router-link to="/vallalkozoHome/profil">Profil</router-link></li>
        <li><router-link to="/vallalkozoHome/ertesitesek">Értesítések</router-link></li>
      </ul>
    </aside>

    <!-- Fő tartalom -->
    <main class="main-content">
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

      <!-- Router view csak egyszer -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "VallalkozoHome",
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
/* Alap konténer */
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

/* Oldalsáv (Dashboard) */
.sidebar {
  width: 250px;
  background-color: #6327A2; /* Sötét lila */
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  margin-top: 80px;
  border-radius: 15px;
  margin-left: 10px;
}

.sidebar h2 {
  margin: 0 0 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.sidebar ul li a:hover {
  color: grey;
}

/* Fő tartalom */
.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #EDEDED;
  margin-top: 70px;
}

.main-content header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-content h1 {
  margin: 0;
  font-size: 24px;
  color: #5A3472;
}

/* Kockák rács (Grid) */
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

/* Új vállalkozás négyzet */
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

/* Felugró ablak háttér */
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

/* Felugró ablak konténer */
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
  gap: 1.5rem; /* Egyenletes távolság az elemek között */
}

/* Formázás a címekhez */
.form-container h2 {
  text-align: center;
  font-size: 22px;
  color: #5a3472;
}

/* Űrlap mezők */
.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Távolság a címke és az input között */
}

.form-group label {
  font-size: 14px;
  color: #5a3472;
  text-align: left; /* Balra igazított címkék */
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

/* Gombok */
.form-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
}

button {
  flex: 1; /* Gombok egyenlő méretűek */
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin: 0 0.5rem; /* Távolság a két gomb között */
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
  border-color: #e74c3c; /* Szegély a gomb színével */
  color: black;

}

.cancel-button:hover {
  background: white;
  transform: scale(1.05);
}
</style>
