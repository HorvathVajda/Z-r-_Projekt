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
          <h2>Személyes adatok</h2>
          <ul>
            <li>
              <strong>Teljes név: </strong>
              <span v-if="!isEditingUserData">{{ userName }}</span>
              <input v-else v-model="editedUserName" class="user-info-input" />
            </li>
            <li>
              <strong>Email: </strong>
              <span v-if="!isEditingUserData">{{ user.email }}</span>
              <input v-else v-model="editedUserEmail" class="user-info-input" disabled/>
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
          <h2>Közelgő foglalások</h2>
          <div v-if="bookings.length > 0">
            <!-- Show first 3 bookings -->
            <div v-for="(booking, index) in displayedBookings" :key="index" class="foglalas-item">
              <p><strong>Időpont:</strong> {{ booking.date }} - {{ booking.time }}</p>
              <p><strong>Ügyfél:</strong> {{ booking.clientName }}</p>
            </div>
            <!-- Show dropdown if there are more than 3 bookings -->
            <div v-if="bookings.length > 3">
              <select v-model="selectedBookingIndex">
                <option disabled value="">További foglalások...</option>
                <option v-for="(booking, index) in additionalBookings" :key="index" :value="index + 3">
                  {{ booking.date }} - {{ booking.time }} (Ügyfél: {{ booking.clientName }})
                </option>
              </select>
            </div>
          </div>
          <p v-else>Nincs még foglalás.</p>
        </div>
      </div>

      <div class="row">
        <!-- Statisztikák -->
        <div class="stats">
          <h2>Statisztikák</h2>
          <div class="stat-item">
            <div><span>Teljesített munkák: </span><span style="color: #6327A2;">{{ teljesitett_munkak }}</span></div>
            <div><span>Eddigi bevétel (br): </span><span style="color: #6327A2;">{{ bevetel }}</span></div>
            <div><span>Összes foglalás: </span><span style="color: #6327A2;">{{ foglalasok }}</span></div>
          </div>
        </div>

        <!-- Időpontok megjelenítése -->
        <div class="idopontok">
          <h2>Időpontok</h2>
          <div v-if="idopontok.length > 0">
            <div v-for="(idopont, index) in idopontok" :key="index" class="foglalas-item">
              <p><strong>Időpont:</strong> {{ idopont.datum }}</p> <!-- Dátum megjelenítése -->
              <p><strong>Foglaló:</strong> {{ idopont.foglalo_nev }}</p>

              <!-- Gomb a teljesítéshez -->
              <button v-if="idopont.statusz !== 'teljesitett'" @click="completeAppointment(idopont.ido_id, getVallalkozoId()); refresh()" class="complete-btn">
                Teljesítés
              </button>
              <p v-else>Ez az időpont teljesítve lett.</p>
            </div>
          </div>
          <p v-else>Nincs időpont ezen a vállalkozáson.</p>
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
        email: localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')).email : '',
        phone: '+36 30 123 4567',
      },
      bookings: [], // Add this line to define bookings
      selectedBookingIndex: null,
      idopontok: [],
      showAll: false,
      teljesitett_munkak: 0,
      bevetel: 0,
      foglalasok: 0
    };
  },
  computed: {
    // Get first 3 bookings to display
    displayedBookings() {
      return this.bookings.slice(0, 3);
    },
    // Get additional bookings to display in dropdown
    additionalBookings() {
      return this.bookings.slice(3);
    },
  },
  mounted() {
    const authData = JSON.parse(localStorage.getItem('authData'));
    const email = authData.email;
    if (authData && authData.email) {
      // Fetch business profile and bookings based on the email
      this.getBusinessProfile(authData.email);
      this.getBookings(authData.id); // Fetch bookings
      this.getIdopontok(authData.id);
      this.fetchStatisztika(authData.id);
    }
  },
  methods: {
    refresh(){
      location.reload();
    },
    toggleShowAll() {
      this.showAll = !this.showAll;
    },
    getVallalkozoId() {
      const authData = JSON.parse(localStorage.getItem('authData'));
      return authData ? authData.id : null;
    },

    getBookings(vallalkozo_id) {
      if (!vallalkozo_id) {
        console.error('Vállalkozó ID nem található!');
        return;  // Ha nincs vállalkozó_id, ne folytasd a lekérdezést
      }

      console.log('Küldött vállalkozó_id:', vallalkozo_id);  // Logoljuk a küldött vállalkozó ID-t

      // Küldd el a vallalkozo_id-t a backendnek
      axios.get(`/api/businesses/bookings?felhasznalo_id=${vallalkozo_id}`)
        .then(response => {
          console.log('Backend válasz:', response.data);  // Logoljuk a választ
          if (response.data && Array.isArray(response.data)) {
            // Itt már közvetlenül a foglalásokat kezeljük
            this.bookings = response.data.map(booking => ({
              date: booking.datum || 'N/A',  // a válaszban a dátum a 'datum' kulcs alatt jön
              time: booking.ora || 'N/A',    // az idő a 'ora' kulcs alatt jön
              clientName: 'Ügyfél'  // itt hozzáadhatsz egy másik logikát, ha szükséges
            }));
          } else {
            console.error('Hibás API válasz:', response.data);
            this.bookings = [];
          }
        })
        .catch(error => {
          console.error('Hiba történt a foglalások lekérése során:', error);
          this.bookings = [];
        });
    },

    getIdopontok(vallalkozo_id) {
      axios.get(`/api/businesses/idopontok?vallalkozo_id=${vallalkozo_id}`)
        .then(response => {
          console.log(response.data);  // Ellenőrizzük, hogy valóban van-e ido_id
          this.idopontok = response.data.idopontok.map(idopont => ({
            ido_id: idopont.ido_id,  // Ha van ido_id, akkor azt is átadjuk
            datum: idopont.datum,    // Az időpont dátuma
            foglalo_nev: response.data.nev || 'N/A',  // A válaszban kapott foglaló neve
            statusz: 'foglalt' // Ez a státusz (esetleg dinamikusan is beállítható)
          }));
        })
        .catch(error => {
          console.error('Hiba történt az időpontok lekérésekor:', error);
        });
    },
    completeAppointment(ido_id, vallalkozo_id) {
      if (!ido_id || !vallalkozo_id) {
        console.error('Nincs érvényes ido_id vagy vallalkozo_id!');
        return;
      }

      // Először lekérdezzük az adatokat a /adatok végpontról
      axios.get(`/api/businesses/adatok?ido_id=${ido_id}&vallalkozo_id=${vallalkozo_id}`)
        .then(response => {
          console.log('Lekért adatok:', response.data);

          // Ha az adatok sikeresen megvannak, végrehajtjuk az időpont teljesítését
          axios.post(`/api/businesses/teljesit?ido_id=${ido_id}&vallalkozo_id=${vallalkozo_id}`)
            .then(response => {
              console.log('Időpont teljesítve:', response.data);
            })
            .catch(error => {
              console.error('Hiba történt az időpont teljesítésekor:', error);
            });
        })
        .catch(error => {
          console.error('Hiba történt az adatok lekérésekor:', error);
        });
    },

    fetchStatisztika(vallalkozo_id) {
      axios.get('/api/businesses/statisztika', { params: { vallalkozo_id } })
        .then(response => {
          // Feldolgozzuk a válasz adatokat
          this.bevetel = response.data.bevetel;
          this.teljesitett_munkak = response.data.teljesitett_munkak;
          this.foglalasok = response.data.foglalasok;
        })
        .catch(error => {
          console.error('Hiba történt a statisztikák betöltésekor:', error);
        });
    },

    toggleEditBio() {
      this.isEditingBio = true;
      this.editedBio = this.userBio;
    },
    saveBio() {
      this.isEditingBio = false;
      if (this.editedBio.trim() !== '') {
        axios.post('/api/businesses/update-bio', { email: this.user.email, bio: this.editedBio })
          .then(response => {
            console.log('Bio frissítve:', response.data.userProfile);
            this.userBio = response.data.userProfile.bio;
            this.userName = response.data.userProfile.name;
          })
          .catch(error => {
            console.error('Hiba történt a bio mentése közben:', error);
          });
      }
    },
    cancelEdit() {
      this.isEditingBio = false;
    },
    toggleEditUserData() {
      this.isEditingUserData = !this.isEditingUserData;
      if (!this.isEditingUserData) {
        this.editedUserName = '';
        this.editedUserEmail = '';
        this.editedUserPhone = '';
      } else {
        this.editedUserName = this.userName;
        this.editedUserEmail = this.user.email;
        this.editedUserPhone = this.user.phone;
      }
    },
    saveUserData() {
  this.isEditingUserData = false;
  if (this.editedUserName.trim() && this.editedUserPhone.trim()) {
    axios.post('/api/businesses/update-user', {
      email: this.user.email,
      nev: this.editedUserName,
      telefonszam: this.editedUserPhone,
    })
      .then(response => {
        this.userName = this.editedUserName;
        this.user.phone = this.editedUserPhone;
      })
      .catch(error => {
        console.error('Hiba történt a személyes adatok mentése során:', error);
      });
  }
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
    getBusinessProfile(email) {
      // Lekérjük a vállalkozó adatokat az email alapján
      axios.get(`/api/businesses/vallalkozo-profile?email=${email}`)
        .then(response => {
          if (response.data) {
            // Frissítjük az adatokat a profilban
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
/* Alap stílusok és elrendezés */
.container {
  display: contents;
  flex-direction: column;
  align-items: center;  /* Középre igazítás */
  justify-content: flex-start;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.idopontok {
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #9d9ff4;
  width: 100%;
  max-width: 1200px;
  height: 400px;
  flex-grow: 1;
  overflow-y: auto;
  transition: height 0.3s ease;
}

.idopontok.show-all {
  height: auto;
}

.show-all-btn {
  background-color: #6327A2;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.show-all-btn:hover {
  background-color: #9d9ff4;
}

.foglalas-item {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #9d9ff4;
}

.foglalas-item p {
  margin: 5px 0;
  color: #555;
  font-size: 16px;
}

.foglalas-item strong {
  color: #6327A2;
}

.complete-btn {
  background-color: #6327A2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.complete-btn:hover {
  background-color: #9d9ff4;
}

.complete-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
  border: 2px solid #9d9ff4;
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

.edit-btn {
  background-color: #6327A2;
  color: white;
  padding: 0.55rem 1rem;
  border-radius: 100px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  width: auto;
  position: absolute; /* Pozicionálás a szülőhöz képest */
  top: 50%; /* Függőlegesen középre igazítjuk */
  right: 20px; /* Jobbra toljuk */
  transform: translateY(-50%); /* Függőlegesen középre igazítjuk */
}


.edit-btn:hover {
  background-color: #9d9ff4;
  box-shadow: 0 4px 8px rgba(99, 39, 162, 0.3);
}

.edit-btn:active {
  transform: translateY(1px);
  box-shadow: none;
}

.edit-btn:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(99, 39, 162, 0.5);
}

/* Személyes adatok és foglalások */
.user-info, .stats, .foglalasok, .idopontok {
  flex: 1;
  padding: 20px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 45%;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  border: 2px solid #9d9ff4;
  margin-bottom: 20px;
}

.stats {
  padding: 20px;
  border-radius: 8px;
  height: 210px;
  overflow-y: auto;
}

.stat-item {
  display: block;
  margin-top: 10px;
}

.stat-item div {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
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

/* Reszponzív stílusok */
@media screen and (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .idopontok, .foglalas-item {
    margin: 10px;
    padding: 15px;
    width: 100%;
  }

  .follow-btn, .complete-btn, .edit-btn {
    width: 100%;
    font-size: 16px;
    padding: 12px;
  }

  .profile-card {
    padding: 15px;
  }

  .profile-image {
    width: 80px;
    height: 80px;
  }

  .bio-container {
    flex-direction: column;
    align-items: stretch;
  }

  .user-info, .stats, .foglalasok {
    min-width: 100%;
    flex: 1;
    margin: 10px 0;
  }

  .stat-item div {
    font-size: 16px;
  }

  .user-info-input {
    font-size: 14px;
  }

  /* A "show-all-btn" és hasonló gombok kisebb képernyőkön */
  .show-all-btn {
    width: 100%;
    padding: 12px;
  }
}
</style>
