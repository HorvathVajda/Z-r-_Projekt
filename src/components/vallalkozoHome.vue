<template>
  <div class="dashboard-container">
    <!-- Oldalsáv -->
    <aside class="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><a href="#">Beállítások</a></li>
        <li><a href="#">Profil</a></li>
        <li><a href="#">Értesítések</a></li>
      </ul>
    </aside>

    <!-- Fő tartalom -->
    <main class="main-content">
      <header>
        <h1>Vállalkozásaim</h1>
      </header>
      <div class="business-grid">
        <!-- Példa kockák -->
        <div class="business-card">Vállalkozás 1</div>
        <!-- Új vállalkozás négyzet -->
        <div class="business-card add-business-card" @click="showForm = true">
          <span>+</span>
        </div>
      </div>

      <!-- Új vállalkozás űrlap -->
      <div v-if="showForm" class="form-overlay">
        <div class="form-container">
          <form @submit.prevent="addBusiness">
            <h2>Új Vállalkozás Hozzáadása</h2>
            <div>
              <label for="name">Vállalkozás neve:</label>
              <input type="text" id="name" v-model="newBusiness.name" required />
            </div>
            <div>
              <label for="category">Kategória:</label>
              <input type="text" id="category" v-model="newBusiness.category" required />
            </div>
            <div>
              <label for="description">Leírás:</label>
              <textarea id="description" v-model="newBusiness.description"></textarea>
            </div>
            <div class="form-buttons">
              <button type="submit">Hozzáadás</button>
              <button type="button" @click="showForm = false">Mégse</button>
            </div>
          </form>
        </div>
      </div>
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
    };
  },
  methods: {
    addBusiness() {
      if (this.newBusiness.name && this.newBusiness.category) {
        alert(`Új vállalkozás hozzáadva: ${this.newBusiness.name}`);
        // Itt lehet az adatbázisba küldeni az adatokat vagy frissíteni a listát
        this.newBusiness = { name: "", category: "", description: "" };
        this.showForm = false;
      }
    },
  },
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
  background-color: #D3A537;
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
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}
</style>
