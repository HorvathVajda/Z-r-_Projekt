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
    </div>

    <div class="content">
      <div class="row">
        <!-- Személyes adatok -->
        <div class="user-info">
          <h3>Személyes adatok</h3>
          <ul>
            <li>
              <strong>Teljes név: </strong>
              <span v-if="!isEditingUserData">{{ userName }}</span>
              <input v-else v-model="editedUserName" class="user-info-input" />
            </li>
            <li>
              <strong>Email: </strong>
              <span v-if="!isEditingUserData">{{ user.email }}</span>
              <input v-else v-model="editedUserEmail" class="user-info-input" />
            </li>
            <li>
              <strong>Telefon: </strong>
              <span v-if="!isEditingUserData">{{ user.phone }}</span>
              <input v-else v-model="editedUserPhone" class="user-info-input" />
            </li>
            <button class="edit-btn" @click="toggleEditUserData" v-if="!isEditingUserData">Szerkesztés</button>
            <button class="save-btn" @click="saveUserData" v-if="isEditingUserData">Mentés</button>
            <button class="cancel-btn" @click="cancelEditUserData" v-if="isEditingUserData">Mégse</button>
          </ul>
        </div>

        <!-- Foglalások -->
        <div class="foglalasok">
          <h3>Foglalások</h3>
          <div>
            <div v-for="(booking, index) in bookings" :key="index" class="foglalas-item">
              <p><strong>Időpont:</strong> {{ booking.date }} - {{ booking.time }}</p>
              <p><strong>Ügyfél:</strong> {{ booking.clientName }}</p>
            </div>
          </div>
          <p>Nincs még foglalás.</p>
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
      isEditingUserData: false,
      editedUserName: '',
      editedUserEmail: '',
      editedUserPhone: '',
      user: {
        email: localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')).email : '', // Az email értéke a localStorage-ból
        phone: '+36 30 123 4567'
      },
      stats: [
        { label: 'Ügyfél elégedettség', value: 90 },
        { label: 'Teljesítési arány', value: 75 }
      ]
    };
  },
  mounted() {
    const authData = JSON.parse(localStorage.getItem('authData'));
  if (authData && authData.email) {
    this.user.vallalkozo_id = authData.id;  // Ne felejtsd el hozzárendelni
    this.getBusinessProfile(authData.id);
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
    console.log("Sending bio update:", this.user.vallalkozo_id, this.editedBio);  // Add this line for debugging
    axios.post('/api/businesses/update-bio', {
      email: this.user.email,
      vallalkozo_id: this.user.vallalkozo_id,
      bio: this.editedBio
    })
      .then(response => {
        // handle success
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
    toggleEditUserData() {
      this.isEditingUserData = !this.isEditingUserData;
      if (!this.isEditingUserData) {
        // Reset the edited data to the original values if canceling
        this.editedUserName = '';
        this.editedUserEmail = '';
        this.editedUserPhone = '';
      } else {
        // Populate fields with current values for editing
        this.editedUserName = this.userName;
        this.editedUserEmail = this.user.email;
        this.editedUserPhone = this.user.phone;
      }
    },
    saveUserData() {
      this.isEditingUserData = false;
      if (this.editedUserName.trim() && this.editedUserPhone.trim()) {
        // Frissített adatok küldése a backendnek
        axios.post('/api/businesses/update-user', {
          email: this.user.email, // Az eredeti emailt küldjük
          nev: this.editedUserName, // A backend "nev"-et várja
          telefonszam: this.editedUserPhone, // A backend "telefonszam"-ot várja
        })
          .then(response => {
            // Sikeres frissítés esetén frissítjük a frontend állapotát
          })
          .catch(error => {
            console.error('Hiba történt a személyes adatok mentése során:', error);
          });
      }
      this.userName = this.editedUserName;
      this.user.phone = this.editedUserPhone;
    },
    cancelEditUserData() {
      this.isEditingUserData = false;
      this.editedUserName = '';
      this.editedUserEmail = '';
      this.editedUserPhone = '';
    },
    logout() {
      localStorage.removeItem('authData');
      this.$router.push('/login');
    },
    getBusinessProfile(vallalkozo_id) {
      axios.get(`/api/businesses/vallalkozo-profile?vallalkozo_id=${vallalkozo_id}`)
        .then(response => {
          if (response.data) {
            this.userName = response.data.name;
            this.userBio = response.data.bio;
            this.user.email = response.data.email;
            this.user.phone = response.data.phone;
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

/* Alap stílusok és elrendezés */
h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  font-size: 1.2rem;
}

strong {
  font-weight: bold;
}
</style>
