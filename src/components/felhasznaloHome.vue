<template>
  <div class="dashboard-container">
    <!-- Oldalsáv -->
    <aside class="sidebar">
      <h2 class="sidebar-header">
        <router-link to="" class="header-link">Felhasználói adatok</router-link>
      </h2>
      <ul>
        <li>
          <router-link to="/felhasznaloProfil">Profil Szerkesztés</router-link>
        </li>
        <li>
          <router-link to="/Foglalas">Foglalj</router-link>
        </li>
      </ul>
    </aside>

    <!-- Fő tartalom -->
    <main class="main-content">
      <!-- Felhasználó neve és profilképe -->
      <div class="user-profile-card">
        <img :src="userData.profilkep" alt="Felhasználónév: " class="profile-pic" />
        <h3>{{ userData.nev }}</h3>
      </div>
      
      <div class="card-container">
        <!-- Személyes adatok -->
        <div class="info-card">
          <h2>Személyes adatok</h2>
          <p>Teljes név: {{ userData.nev }}</p>
          <p>Email: {{ userData.email }}</p>
          <p>Telefon: {{ userData.telefon || 'Nincs megadva' }}</p>
        </div>
        
        <!-- Foglalások -->
        <div class="info-card">
          <h2>Foglalásaid</h2>
          <div v-if="foglalasok.length > 0">
            <ul>
              <li v-for="foglalas in foglalasok" :key="foglalas.id">
                Időpont: {{ foglalas.datum }} - {{ foglalas.ora }}
              </li>
            </ul>
          </div>
          <p v-else>Nincs aktív foglalásod.</p>
        </div>
        
        <!-- Statisztikák -->
        <div class="info-card">
          <h2>Statisztikák</h2>
          <p>Összes foglalás: {{ statisztikak.osszesFoglalas }}</p>
          <p>Legutóbbi foglalás: {{ statisztikak.utolsoFoglalas || 'Nincs adat' }}</p>
          <p>Heti aktivitás: {{ statisztikak.aktivitas || 'Nincs adat' }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const userData = ref({
  nev: '',
  email: '',
  telefon: '',
  profilkep: ''
});

const foglalasok = ref([]);
const statisztikak = ref({
  osszesFoglalas: 0,
  utolsoFoglalas: '',
  aktivitas: 0
});

const fetchUserData = async () => {
  try {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData || !authData.id) {
      console.error('Hiányzó felhasználói adatok');
      return;
    }
    const response = await axios.get('/api/felhasznalo/felhasznalo', {
      params: { id: authData.id }
    });
    userData.value = response.data;
  } catch (error) {
    console.error('Hiba a felhasználói adatok betöltésekor:', error);
  }
};

const fetchFoglalasok = async () => {
  try {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData || !authData.id) {
      return;
    }

    const token = authData.token; // Feltételezve, hogy a token az authData-ban van
    const response = await axios.get('/api/felhasznalo/foglalasok', {
      params: { felhasznalo_id: authData.id },
      headers: {
        Authorization: `Bearer ${token}`, // Hozzáadjuk a token-t a kéréshez
      },
    });
    foglalasok.value = response.data;
  } catch (error) {
    console.error('Hiba a foglalások betöltésekor:', error);
  }
};

const fetchStatisztikak = async () => {
  try {
    const response = await axios.get('/api/felhasznalo/statisztikak');
    statisztikak.value = response.data;
  } catch (error) {
    console.error('Hiba a statisztikák betöltésekor:', error);
  }
};

onMounted(() => {
  fetchUserData();
  fetchFoglalasok();
  fetchStatisztikak();
});
</script>

<style scoped>

.dashboard-container {
    display: flex;
    height: 100vh;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
  
  /* Oldalsáv */
  .sidebar {
    width: 250px;
    background-color: #6B00D0;
    color: white;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    margin-top: 80px;
    border-radius: 15px;
    margin-left: 10px;
  }
  
  .header-link {
    color: white;
    text-decoration: none;
    font-size: 35px;
    display: block;
    transition: color 0.3s;
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
    font-size: 18px;
    transition: color 0.3s;
  }
  
  .sidebar ul li a:hover {
    background: transparent;
  }
  
  .logout-button {
    width: 100%;
    padding: 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s;
  }
  
  .logout-button:hover {
    background-color: darkred;
  }
  
  /* Fő tartalom */
  .main-content {
    flex-grow: 1;
    padding: 20px;
    background-color: #EDEDED;
    margin-top: 70px;
    text-align: center;
  }
  
  .user-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 300px;
    margin: auto;
  }
  
  .foglalasok-container {
    margin-top: 30px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .foglalasok-container h2 {
    color: #6B00D0;
  }
  
  .foglalasok-container ul {
    list-style-type: none;
    padding: 0;
  }
  
  .foglalasok-container li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }
  
  .foglalasok-container li:last-child {
    border-bottom: none;
  }
  
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #6B00D0;
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  margin-top: 80px;
  border-radius: 15px;
  margin-left: 10px;
}

.header-link {
  color: white;
  text-decoration: none;
  font-size: 35px;
  display: block;
  transition: color 0.3s;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #EDEDED;
  margin-top: 70px;
  text-align: center;
}

.user-profile-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;
  margin: auto;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.card-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}
</style>
