<template>
  <div class="dashboard-container">
    <!-- Oldalsáv -->
    <aside class="sidebar">
      <h2 class="sidebar-header">
        <router-link to="" class="header-link">Felhasználói adatok</router-link>
      </h2>
      <ul>
        <li>
          <router-link to="/felhasznaloProfil">Profil</router-link>
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
        <img :src="userData.profilkep" alt="Profilkép" class="profile-pic" />
        <h3>{{ userData.nev }}</h3>
      </div>
      
      <div class="card-container">
        <!-- Személyes adatok -->
        <div class="info-card">
          <h2>Személyes adatok</h2>
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
  utolsoFoglalas: ''
});

const fetchUserData = async () => {
  try {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData || !authData.id) {
      console.error('Hiányzó felhasználói adatok');
      return;
    }
    const response = await axios.get('/api/users/felhasznalo', {
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
    const response = await axios.get('/api/foglalasok', {
      params: { felhasznalo_id: authData.id }
    });
    foglalasok.value = response.data;
    statisztikak.value.osszesFoglalas = foglalasok.value.length;
    statisztikak.value.utolsoFoglalas = foglalasok.value.length > 0 ? foglalasok.value[foglalasok.value.length - 1].datum : '';
  } catch (error) {
    console.error('Hiba a foglalások betöltésekor:', error);
  }
};

onMounted(() => {
  fetchUserData();
  fetchFoglalasok();
});
</script>

<style scoped>
/* Alap elrendezés */
.container, .content {
  display: unset;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
  padding: 10px;
}

/* Profil kártya */
.profile-card {
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  max-width: 100%;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

button {
  margin: 5px;
  padding: 10px;
  border: none;
  cursor: pointer;
}

/* Foglalás gomb */
.follow-btn {
  background: #6327A2;
  color: white;
  width: 10%;
  font-size: 18px;
  font-weight: bold;
  padding: 0.55rem 1rem;
  border-radius: 100px;
  margin: 10px;
  transition: transform 0.3s;
}

.follow-btn:hover {
  transform: translateY(-3px);
}

/* Editálás gomb */
.edit-btn {
  position: absolute;
  right: 5%;
  top: 30%;
  font-size: 20px;
  font-weight: bold;
  padding: 0.55rem 1rem;
  border-radius: 100px;
  cursor: pointer;
}

.edit-btn:hover {
  transform: translateY(-3px);
}

/* Személyes adatok és foglalások */
.user-info, .stats, .foglalasok, .idopontok {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 45%;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

/* Bio szakasz */
.bio-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.edit-bio-container {
  display: flex;
  gap: 5px;
}

.bio-input {
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.edit-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* Mentés és Mégse gombok */
.save-btn, .cancel-btn {
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.save-btn {
  background: #9d9ff4;
  color: white;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.user-info-input {
  padding: 8px 12px;
  font-size: 16px;
  border: 2px solid #6327A2;
  border-radius: 8px;
  outline: none;
  width: 100%;
  background: #f9f9f9;
  transition: all 0.3s ease-in-out;
}

.user-info-input:focus {
  border-color: #9d9ff4;
  background: #fff;
  box-shadow: 0 0 8px rgba(99, 39, 162, 0.3);
}

/* Oldalsáv */
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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
</style>

