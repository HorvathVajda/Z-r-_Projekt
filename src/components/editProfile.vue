<template>
  <div class="settings-page">
    <h1>Beállítások</h1>
    <div class="settings-menu">
      <ul>
        <li @click="activeSection = 'profil'" :class="{ active: activeSection === 'profil' }">Profil</li>
        <li @click="activeSection = 'password'" :class="{ active: activeSection === 'password' }">Jelszó módosítás</li>
        <li @click="activeSection = 'notifications'" :class="{ active: activeSection === 'notifications' }">Értesítések</li>
        <li @click="activeSection = 'privacy'" :class="{ active: activeSection === 'privacy' }">Adatvédelem</li>
      </ul>
    </div>

    <div class="settings-content">
      <div v-if="activeSection === 'profil'">
        <h2>Profil beállítások</h2>
        <form @submit.prevent="updateProfile">
          <div>
            <label for="name">Név:</label>
            <input type="text" v-model="profile.name" id="name" />
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" v-model="profile.email" id="email" />
          </div>
          <div>
            <label for="profileImage">Profilkép:</label>
            <input type="file" @change="handleFileUpload" id="profileImage" />
            <img v-if="profile.imageUrl" :src="profile.imageUrl" alt="Profilkép" width="100" />
          </div>
          <button type="submit">Módosítás mentése</button>
        </form>
      </div>
      <div v-if="activeSection === 'password'">
        <h2>Jelszó módosítása</h2>
        <form @submit.prevent="updatePassword">
          <div>
            <label for="currentPassword">Jelenlegi jelszó:</label>
            <input type="password" v-model="password.current" id="currentPassword" required />
          </div>
          <div>
            <label for="newPassword">Új jelszó:</label>
            <input type="password" v-model="password.new" id="newPassword" required />
          </div>
          <div>
            <label for="confirmPassword">Új jelszó megerősítése:</label>
            <input type="password" v-model="password.confirm" id="confirmPassword" required />
          </div>
          <button type="submit">Jelszó módosítása</button>
        </form>
      </div>
      <div v-if="activeSection === 'notifications'">
        <h2>Értesítések</h2>
        <form @submit.prevent="updateNotifications">
          <div>
            <label for="emailNotifications">Email értesítések:</label>
            <input type="checkbox" v-model="notifications.email" id="emailNotifications" />
          </div>
          <div>
            <label for="smsNotifications">SMS értesítések:</label>
            <input type="checkbox" v-model="notifications.sms" id="smsNotifications" />
          </div>
          <button type="submit">Módosítás mentése</button>
        </form>
      </div>
      <div v-if="activeSection === 'privacy'">
        <h2>Adatvédelem</h2>
        <form @submit.prevent="updatePrivacy">
          <div>
            <label for="dataSharing">Személyes adatok megosztása:</label>
            <input type="checkbox" v-model="privacy.dataSharing" id="dataSharing" />
          </div>
          <div>
            <label for="locationTracking">Helymeghatározás engedélyezése:</label>
            <input type="checkbox" v-model="privacy.locationTracking" id="locationTracking" />
          </div>
          <button type="submit">Módosítás mentése</button>
        </form>
      </div>
    </div>
  </div>
  <button class="save-btn" @click="saveSettings">Beállítások mentése</button>

</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const profile = ref({
  name: '',
  email: '',
  imageUrl: ''
});

const updateProfile = async () => {
  try {
    const response = await axios.put('http://localhost:3000/api/updateProfile', profile.value);
    console.log('Profil frissítve:', response.data);
  } catch (error) {
    console.error('Hiba történt a profil frissítésekor:', error);
  }
};

const saveSettings = () => {
  // Az összes beállítást mentheted itt (pl. API hívások)
  console.log('Beállítások mentése...');
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    profile.value.imageUrl = URL.createObjectURL(file);
  }
};

const password = ref({
  current: '',
  new: '',
  confirm: ''
});

const updatePassword = async () => {
  if (password.value.new !== password.value.confirm) {
    alert('A két jelszó nem egyezik!');
    return;
  }

  try {
    const response = await axios.put('http://localhost:3000/api/updatePassword', password.value);
    console.log('Jelszó frissítve:', response.data);
  } catch (error) {
    console.error('Hiba történt a jelszó frissítésekor:', error);
  }
};

const notifications = ref({
  email: true,
  sms: false
});

const updateNotifications = async () => {
  try {
    const response = await axios.put('http://localhost:3000/api/updateNotifications', notifications.value);
    console.log('Értesítések frissítve:', response.data);
  } catch (error) {
    console.error('Hiba történt az értesítések frissítésekor:', error);
  }
};

const privacy = ref({
  dataSharing: false,
  locationTracking: true
});

const updatePrivacy = async () => {
  try {
    const response = await axios.put('http://localhost:3000/api/updatePrivacy', privacy.value);
    console.log('Adatvédelmi beállítások frissítve:', response.data);
  } catch (error) {
    console.error('Hiba történt az adatvédelmi beállítások frissítésekor:', error);
  }
};



// Aktív szekció tárolása
const activeSection = ref('profil');
</script>

<style scoped>
.settings-page {
  padding: 20px;
}

.settings-menu {
  width: 200px;
  float: left;
  margin-right: 20px;
}

.settings-menu ul {
  list-style: none;
  padding: 0;
}

.settings-menu li {
  padding: 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  text-align: center;
}

.settings-menu li.active {
  background-color: #f0f0f0;
  font-weight: bold;
}

.settings-content {
  margin-left: 220px;
  width: auto;

}

h2 {
  color: #333;
}

p {
  font-size: 16px;
}
.save-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin-top: 20px;
}

.save-btn:hover {
  background-color: #45a049;
}

</style>
