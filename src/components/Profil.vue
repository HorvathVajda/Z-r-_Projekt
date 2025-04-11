<template>
  <div class="container">
    <!-- Main Profile Section -->
    <div class="profile-section">
      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-header">
          <img :src="profileImage" alt="Profilkép" class="profile-image" />
          <h2>{{ userName }}</h2>
          <div class="profile-actions">
            <button @click="logout" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i> Kijelentkezés
            </button>
          </div>
        </div>

        <div class="bio-container">
          <p v-if="!isEditingBio" class="bio-text">{{ userBio || 'Nincs megadott bemutatkozás' }}</p>
          <div v-else class="edit-bio-container">
            <textarea v-model="editedBio" class="bio-input" rows="3"></textarea>
            <div class="bio-actions">
              <button @click="saveBio" class="btn save-btn">
                <i class="fas fa-check"></i> Mentés
              </button>
              <button @click="cancelEdit" class="btn cancel-btn">
                <i class="fas fa-times"></i> Mégse
              </button>
            </div>
          </div>
          <button v-if="!isEditingBio" @click="toggleEditBio" class="btn edit-btn">
            <i class="fas fa-edit"></i> Szerkesztés
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <h3>{{ teljesitett_munkak }}</h3>
            <p>Teljesített munkák</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-info">
            <h3>{{ bevetel }} Ft</h3>
            <p>Összbevétel</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-info">
            <h3>{{ foglalasok }}</h3>
            <p>Összes foglalás</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-area">
      <!-- Personal Info Section -->
      <div class="info-section">
        <div class="section-header">
          <h2><i class="fas fa-user"></i> Személyes adatok</h2>
          <button class="btn edit-btn" @click="toggleEditUserData" v-if="!isEditingUserData">
            <i class="fas fa-edit"></i> Szerkesztés
          </button>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label>Teljes név</label>
            <span v-if="!isEditingUserData">{{ userName }}</span>
            <input v-else v-model="editedUserName" class="form-input" />
          </div>

          <div class="info-item">
            <label>Email cím</label>
            <span v-if="!isEditingUserData">{{ user.email }}</span>
            <input v-else v-model="editedUserEmail" class="form-input" disabled />
          </div>

          <div class="info-item">
            <label>Telefonszám</label>
            <span v-if="!isEditingUserData">{{ user.phone }}</span>
            <input v-else v-model="editedUserPhone" class="form-input" />
          </div>
        </div>

        <div v-if="isEditingUserData" class="form-actions">
          <button @click="saveUserData" class="btn save-btn">
            <i class="fas fa-save"></i> Mentés
          </button>
          <button @click="cancelEditUserData" class="btn cancel-btn">
            <i class="fas fa-times"></i> Mégse
          </button>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div class="info-section">
        <div class="section-header">
          <h2><i class="fas fa-calendar-alt"></i> Közelgő foglalások</h2>
        </div>

        <div v-if="bookings.length > 0" class="appointments-list">
          <!-- Show first 3 bookings -->
          <div v-for="(booking, index) in displayedBookings" :key="index" class="appointment-card">
            <div class="appointment-time">
              <i class="fas fa-clock"></i>
              <span>{{ booking.date }} - {{ booking.time }}</span>
            </div>
            <div class="appointment-client">
              <i class="fas fa-user"></i>
              <span>{{ booking.clientName }}</span>
            </div>
            <div class="appointment-actions">
              <button class="btn complete-btn">
                <i class="fas fa-check"></i> Teljesítés
              </button>
            </div>
          </div>

          <!-- Show dropdown if there are more than 3 bookings -->
          <div v-if="bookings.length > 3" class="more-appointments">
            <select v-model="selectedBookingIndex" class="form-select">
              <option disabled value="">További foglalások...</option>
              <option v-for="(booking, index) in additionalBookings" :key="index" :value="index + 3">
                {{ booking.date }} - {{ booking.time }} (Ügyfél: {{ booking.clientName }})
              </option>
            </select>
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <p>Nincs még foglalás</p>
        </div>
      </div>

      <!-- All Appointments -->
      <div class="info-section">
        <div class="section-header">
          <h2><i class="fas fa-list"></i> Összes időpont</h2>
        </div>

        <div v-if="idopontok.length > 0" class="appointments-list">
          <div v-for="(idopont, index) in idopontok" :key="index" class="appointment-card">
            <div class="appointment-time">
              <i class="fas fa-clock"></i>
              <span>{{ idopont.datum }}</span>
            </div>
            <div class="appointment-client">
              <i class="fas fa-user"></i>
              <span>{{ idopont.foglalo_nev }}</span>
            </div>
            <div class="appointment-status">
              <span v-if="idopont.statusz === 'teljesitett'" class="status-badge completed">
                <i class="fas fa-check-circle"></i> Teljesítve
              </span>
              <button v-else @click="completeAppointment(idopont.ido_id, getVallalkozoId())" class="btn complete-btn">
                <i class="fas fa-check"></i> Teljesítés
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <p>Nincs időpont ezen a vállalkozáson</p>
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
              // Frissíthetjük a UI-t, ha sikeres a teljesítés
              this.refresh();
            })
            .catch(error => {
              console.error('Hiba történt az időpont teljesítésekor:', error);
              showAlert('Hiba történt az időpont teljesítésekor!');
            });
        })
        .catch(error => {
          console.error('Hiba történt az adatok lekérésekor:', error);
          showAlert('Hiba történt az adatok lekérésekor!');
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
    refresh() {
      console.log('Frissítve!');
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
/* Font and Base Styles */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

:root {
  --primary-color: #6c5ce7;
  --secondary-color: #a29bfe;
  --accent-color: #00cec9;
  --dark-color: #2d3436;
  --light-color: #f5f6fa;
  --success-color: #00b894;
  --danger-color: #d63031;
  --warning-color: #fdcb6e;
  --border-radius: 12px;
  --box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
  color: var(--dark-color);
  line-height: 1.6;
}

/* Container Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 60px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 992px) {
  .container {
    grid-template-columns: 350px 1fr;
  }
}

/* Profile Section */
.profile-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 25px;
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.profile-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 5px;
}

.profile-actions {
  margin-top: 15px;
}

/* Bio Section */
.bio-container {
  margin-top: 20px;
}

.bio-text {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
  padding: 15px;
  background-color: var(--light-color);
  border-radius: var(--border-radius);
}

.edit-bio-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bio-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  transition: var(--transition);
}

.bio-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
}

.bio-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
}

.stat-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: var(--transition);
}


.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 1.2rem;
}

.stat-info h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 5px;
}

.stat-info p {
  font-size: 0.8rem;
  color: #777;
}

/* Content Area */
.content-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 25px;
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.section-header h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--dark-color);
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-header h2 i {
  color: var(--primary-color);
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 5px;
}

.info-item span {
  font-size: 1rem;
  font-weight: 500;
  color: var(--dark-color);
  padding: 10px 15px;
  background-color: var(--light-color);
  border-radius: var(--border-radius);
}

.form-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Appointments List */
.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.appointment-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: var(--light-color);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
  transition: var(--transition);
}

.appointment-time, .appointment-client {
  display: flex;
  align-items: center;
  gap: 10px;
}

.appointment-time i {
  color: var(--primary-color);
}

.appointment-client i {
  color: var(--accent-color);
}

.appointment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-badge.completed {
  background-color: rgba(0, 184, 148, 0.1);
  color: var(--success-color);
}

.more-appointments {
  margin-top: 15px;
}

.form-select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  background-color: white;
  transition: var(--transition);
}

.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #777;
}

.empty-state i {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #ccc;
}

.empty-state p {
  font-size: 1rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}

.btn i {
  font-size: 0.9rem;
}

.edit-btn {
  background-color: rgba(108, 92, 231, 0.7);
  color: black;
}

.edit-btn:hover {
  background-color: rgba(108, 92, 231, 0.4);
  transform: translateY(-2px);
}

.save-btn {
  background-color: rgba(108, 92, 231, 0.7);
  color: black;
}

.save-btn:hover {
  background-color: rgba(108, 92, 231, 0.4);
  transform: translateY(-2px);
  color: black;
}

.cancel-btn {
  background-color: rgba(108, 92, 231, 0.7);
  color: black;
}

.cancel-btn:hover {
  background-color: rgba(108, 92, 231, 0.4);
  transform: translateY(-2px);
  color: black;
}

.complete-btn {
  background-color: rgba(108, 92, 231, 0.7);
  color: black;
  padding: 8px 15px;
  font-size: 0.85rem;
}

.complete-btn:hover {
  background-color: rgba(108, 92, 231, 0.4);
  transform: translateY(-2px);
}

.logout-btn {
  background-color: black;
  color: white;
  border: 1px solid var(--danger-color);
  padding: 8px 15px;
  font-size: 0.85rem;
}

.logout-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  transform: translateY(-2px);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 15px;
  }

  .profile-section {
    order: -1;
  }

  .stats-overview {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .profile-header h2 {
    font-size: 1.3rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }

  .btn {
    padding: 8px 15px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .profile-card, .info-section {
    padding: 20px 15px;
  }

  .profile-image {
    width: 90px;
    height: 90px;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>