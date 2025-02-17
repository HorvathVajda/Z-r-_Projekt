<template>
  <div class="container">
    <!-- Profil rész -->
    <div class="profile-card">
      <img :src="profileImage" alt="Profilkép" class="profile-image" />
      <h2>{{ userName }}</h2>
      <div class="bio-container">
        <p v-if="!isEditingBio">{{ userBio }}</p>
        <div v-else class="edit-bio-container">
          <input v-model="editedBio" class="bio-input" />
          <button @click="saveBio" class="save-btn">Mentés</button>
          <button @click="cancelEdit" class="cancel-btn">Mégse</button>
        </div>
        <button v-if="!isEditingBio" @click="toggleEditBio" class="edit-icon">✏️</button>
      </div>
      <div class="buttons">
        <button class="follow-btn">Foglalás</button>
        <button class="message-btn" @click="logout">Kijelentkezés</button>
      </div>
    </div>

    <div class="content">
      <div class="row">
        <!-- Személyes adatok -->
        <div class="user-info">
          <h3>Személyes adatok</h3>
          <ul>
            <li><strong>Teljes név:</strong> {{ userName }}</li>
            <li><strong>Email:</strong> {{ user.email }}</li>
            <li><strong>Telefon:</strong> {{ user.phone }}</li>

          </ul>
        </div>

        <!-- Foglalások -->
        <div class="foglalasok">
          <h3>Foglalások</h3>
          <div class="foglalas-item"></div>
        </div>
      </div>

      <div class="row">
        <!-- Statisztikák -->
        <div class="stats">
          <h3>Statisztikák</h3>
          <div class="stat-item" v-for="(stat, index) in stats" :key="index">
            <span>{{ stat.label }}</span>
          </div>
        </div>

        <!-- Időpontok -->
        <div class="idopontok">
          <h3>Időpontok</h3>
          <div class="foglalas-item"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      profileImage: '/as.jpg',
      userName: 'Vállalkozó Neve',
      userBio: 'Rövid bemutatkozás...',
      isEditingBio: false,
      editedBio: '',
      user: {
        email: localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')).email : '', // Az email értéke a localStorage-ból
        phone: '+36 30 123 4567'
      },
      stats: [
        { label: 'Projekt sikeresség', value: 80 },
        { label: 'Ügyfél elégedettség', value: 90 },
        { label: 'Teljesítési arány', value: 75 }
      ]
    };
  },
  mounted() {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (authData && authData.email) {
      // Az email alapján lekérjük a vállalkozó adatokat
      this.getBusinessProfile(authData.email);
    }
  },
  methods: {
    toggleEditBio() {
      this.isEditingBio = true;
      this.editedBio = this.userBio;
    },
    saveBio() {
      this.isEditingBio = false;
      if (this.editedBio.trim() !== '') {
        // Frissítjük a bio-t az adatbázisban
        axios.post('/api/businesses/update-bio', { email: this.user.email, bio: this.editedBio })
          .then(response => {

          })
          .catch(error => {
            console.error('Hiba történt a mentés során:', error);
          });
      }
      this.userBio = this.editedBio;
    },

    cancelEdit() {
      this.isEditingBio = false;
    },
    logout() {
      localStorage.removeItem('authData');
      this.$router.push('/login');
    },
    getBusinessProfile(email) {
      // Lekérjük a vállalkozó adatokat az email alapján
      axios.get(`/api/businesses/vallalkozo-profile?email=${email}`)
        .then(response => {
          if (response.data) {
            // Frissítjük az adatokat a profilban
            this.userName = response.data.name;  // A név
            this.userBio = response.data.bio;    // A bio
            this.user.email = response.data.email; // Az email
            this.user.phone = response.data.phone; // Telefonszám
          }
        })
        .catch(error => {
          console.error('Hiba történt a vállalkozó adatainak lekérése során:', error);
        });
    }
  }
};
</script>

<style scoped>
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
.buttons button {
  margin: 5px;
  padding: 10px;
  border: none;
  cursor: pointer;
}
.follow-btn, .message-btn{
  font-size: 18px;
  padding: 0.35rem 0.8rem;
  font-size: 20px;
  font-weight: bold;
  padding: 0.55rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 100px;
  margin: 10px;
  transition: transform 0.3s;

}
.follow-btn:hover, .message-btn:hover{
  transform: translateY(-3px);
}

.follow-btn {
  background: #6bb6ea;
  color: black;
}
.message-btn {
  background: #6327A2;
  color: white;
}
.user-info, .stats, .foglalasok, .idopontok {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 45%;
}

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
.save-btn, .cancel-btn {
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.save-btn {
  background: #007bff;
  color: white;
}
.cancel-btn {
  background: #dc3545;
  color: white;
}
</style>
