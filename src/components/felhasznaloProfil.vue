<template>
  <div class="profile-wrapper">
    <!-- Közelgő foglalások kártya -->
    <div class="card">
      <h2>Közelgő foglalásaim</h2>
      <div v-if="upcomingAppointments.length > 0" class="appointments-list">
        <div v-for="appointment in upcomingAppointments" :key="appointment.foglalas_id" class="appointment-item">
          <div class="appointment-info">
            <h3>{{ appointment.szolgaltatas }}</h3>
            <div class="appointment-details">
              <span class="date">{{ appointment.datum }}</span>
            </div>
          </div>
          <button class="btn cancel" @click="cancelAppointment(appointment.foglalas_id)">Lemondás</button>
        </div>
      </div>
      <p v-else class="no-appointments">Nincsenek közelgő foglalások</p>
    </div>

    <!-- Profil összegzés -->
    <div class="card">
      <div class="profile-summary">
        <div class="avatar-wrapper">
          <img v-if="user.profileImage" :src="user.profileImage" alt="Profilkép" class="avatar" />
          <div class="avatar-placeholder" v-else>👤</div>
        </div>
        <div class="user-info">
          <h2>{{ user.nev }}</h2>
          <p>{{ user.email }}</p>
        </div>
      </div>

      <h2>Személyes adatok</h2>

      <div class="field">
        <label>Név</label>
        <input v-model="user.nev" type="text" />
      </div>
      <div class="field">
        <label>Email</label>
        <input v-model="user.email" type="email" />
      </div>
      <div class="field">
        <label>Telefonszám</label>
        <input v-model="user.telefonszam" type="text" />
      </div>

      <!-- Új mentés gomb a személyes adatokhoz -->
      <div class="action-bar personal-data-actions">
        <button class="btn save" @click="savePersonalData">Mentés</button>
      </div>
    </div>

    <!-- Biztonság -->
    <div class="card">
      <h2>Biztonság</h2>
      <form @submit.prevent="updatePassword">
        <div class="field">
          <label>Jelenlegi jelszó</label>
          <input v-model="currentPassword" type="password" />

          <label>Új jelszó</label>
          <input v-model="newPassword" type="password" />

          <label>Új jelszó megerősítése</label>
          <input v-model="confirmPassword" type="password" />
        </div>

        <button type="submit" class="btn save" @click.prevent="updateProfile">Jelszó frissítése</button>
      </form>
    </div>

    <!-- Profilkép -->
    <div class="card">
      <h2>Profilkép</h2>
      <div class="field">
        <input type="file" @change="onFileChange" />
      </div>
    </div>

    <div class="action-bar">
      <button class="btn cancel" @click="reset">Mégse</button>
      <button class="btn save" @click="saveAll">Mentés</button>
      <button class="btn delete" @click="deleteProfile">Profil törlése</button>
    </div>
    <div v-if="alertMessage" class="alert-box">
      {{ alertMessage }}
    </div>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        nev: '',
        email: '',
        telefonszam: '',
        profileImage: ''
      },
      originalUser: {},
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      id: null,
      upcomingAppointments: [],
      alertMessage: null,
    };
  },
  mounted() {
    const authData = JSON.parse(localStorage.getItem('authData'));
    this.id = authData?.id;
    this.fetchProfile();
    this.fetchUpcomingAppointments(authData.id, authData.tipus);
  },
  methods: {
    async saveAll() {
      await this.updateProfile();
      await this.savePersonalData();
    },
    async fetchProfile() {
      if (!this.id) {
        console.error('Nincs ID megadva!');
        return;
      }
      try {
        const response = await axios.get(`/api/felhasznalo/profil/${this.id}`);
        if (!response.data) {
          throw new Error('Üres válasz');
        }
        this.user = response.data;
        this.originalUser = JSON.parse(JSON.stringify(response.data));
      } catch (error) {
        console.error('Hiba:', error);
        this.showAlert('Nem töltődtek be az adatok!');
      }
    },
    async fetchUpcomingAppointments(vallalkozo_id, tipus) {
      try {
        const response = await axios.get(`/api/felhasznalo/bookings?felhasznalo_id=${vallalkozo_id}&tipus=${tipus}`);
        this.upcomingAppointments = response.data || [];
      } catch (error) {
        console.error('Hiba a foglalások betöltésekor:', error);
        this.showAlert('Hiba történt a foglalások betöltésekor!');
      }
    },
    async savePersonalData() {
      try {
        const response = await axios.post(`/api/felhasznalo/profil/${this.id}`, {
          nev: this.user.nev,
          email: this.user.email,
          telefonszam: this.user.telefonszam
        });

        if (response.status === 200) {
          this.showAlert('Személyes adatok sikeresen frissítve!');
          this.originalUser = JSON.parse(JSON.stringify(this.user));
        } else {
          throw new Error('Hiba történt a mentés során');
        }
      } catch (error) {
        console.error('Hiba:', error);
        this.showAlert('Hiba történt az adatok mentése közben!');
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('hu-HU', options);
    },
    async cancelAppointment(appointmentId) {
      if (confirm('Biztosan le szeretnéd mondani ezt a foglalást?')) {
        try {
          await axios.delete(`/api/felhasznalo/${appointmentId}`);
          this.upcomingAppointments = this.upcomingAppointments.filter(a => a.id !== appointmentId);
          this.showAlert('Foglalás sikeresen lemondva!');
          setTimeout(() => {
            location.reload();
          }, 500);
        } catch (error) {
          console.error('Hiba a foglalás lemondásakor:', error);
          this.showAlert('Hiba történt a foglalás lemondása közben');
        }
      }
    },
    async updateProfile() {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        this.showAlert('Kérlek, töltsd ki az összes mezőt!');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.showAlert('Az új jelszavak nem egyeznek!');
        return;
      }

      try {
        const response = await fetch(`/api/felhasznalo/jelszo-valtoztatas/${this.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jelszo: this.currentPassword,
            ujJelszo: this.newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Hiba történt');
        }

        this.showAlert('Jelszó sikeresen megváltoztatva!');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      } catch (error) {
        this.showAlert(`${error.message}`);
      }
    },
    async deleteProfile() {
  const userId = this.id;  // Vagy használj más módszert, hogy megkapd a felhasználó id-ját
  const foglaloTipus = 'felhasznalo'; // Vagy egyéb logika, hogy ezt az értéket meghatározd

  if (!userId) {
    return this.showAlert('Hiba: Nincs megadva felhasználó azonosító.');
  }

  if (confirm('Biztosan törölni szeretnéd a profilodat? Ez nem visszavonható.')) {
    try {
      // Küldjük el a törlés kérését
      const response = await axios.delete(`/api/felhasznalo/felhasznalo`, {
        data: {
          felhasznalo_id: userId,
          foglalo_tipus: foglaloTipus,
        }
      });

      console.log('Backend válasz:', response);

      // Ha sikeres a törlés
      if (response.status === 200) {
        this.showAlert('Profil sikeresen törölve!');
        localStorage.removeItem('authData');
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Hiba a profil törlésekor:', error);

      // Ha a backend 400-as hibát küld, akkor van kapcsolódó foglalás
      if (error.response && error.response.status === 400) {
        console.log('Backend hibája:', error.response.data);
        this.showAlert(error.response.data.error || 'Nem törölhető a profil, mert van kapcsolódó foglalás.');
      } else {
        this.showAlert('Hiba történt a profil törlése közben!');
      }
    }
  }
},


    async reset() {
      this.user = JSON.parse(JSON.stringify(this.originalUser));
      this.showAlert('Változtatások visszaállítva');
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.user.profileImage = URL.createObjectURL(file);
      }
    },
    async showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.alertMessage = null;
      }, 5000);
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  background: #f5f7fa;
}

.profile-wrapper {
  max-width: 700px;
  margin: 90px auto;
  padding: 0 20px;
  font-family: "Segoe UI", sans-serif;
  color: #333;
}

.alert-box {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 90%;
  animation: slideIn 0.3s ease-out;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.card h2 {
  font-size: 18px;
  color: #6327a2;
  margin-bottom: 18px;
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.profile-summary .avatar-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #e1d5f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  overflow: hidden;
}

.profile-summary .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-summary .user-info h2 {
  font-size: 20px;
  margin: 0;
}

.profile-summary .user-info p {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.field label {
  font-weight: 600;
  margin-bottom: 6px;
}

.field input {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  transition: 0.3s;
}

.field input:focus {
  outline: none;
  border-color: #a271d2;
  background-color: #faf8ff;
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

.personal-data-actions {
  margin-top: 20px;
  margin-bottom: 0;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn.save {
  background-color: #6327a2;
  color: white;
}

.btn.save:hover {
  background-color: #7a3ec7;
}

.btn.cancel {
  background-color: #e0e0e0;
}

.btn.cancel:hover {
  background-color: #cfcfcf;
}

.btn.delete {
  background-color: #e74c3c;
  color: white;
}

.btn.delete:hover {
  background-color: #c0392b;
}

/* Közelgő foglalások stílusai */
.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9f5ff;
  border-radius: 10px;
  border-left: 4px solid #a271d2;
}

.appointment-info h3 {
  font-size: 16px;
  margin: 0 0 4px 0;
  color: #6327a2;
}

.business-name {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.appointment-details {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.appointment-details .date {
  color: #333;
  font-weight: 500;
}

.appointment-details .time {
  color: #666;
}

.no-appointments {
  color: #666;
  text-align: center;
  padding: 16px 0;
}

@media (max-width: 600px) {
  .profile-summary {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .card {
    padding: 20px;
  }

  .user-info h2 {
    font-size: 18px;
  }

  .appointment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>