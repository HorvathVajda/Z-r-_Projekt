<template>
  <div class="profile-wrapper">
    <!-- Közelgő foglalások kártya -->
    <div class="card">
      <h2>Közelgő foglalásaim</h2>
      <div v-if="upcomingAppointments.length > 0" class="appointments-list">
        <div v-for="appointment in upcomingAppointments" :key="appointment.id" class="appointment-item">
          <div class="appointment-info">
            <h3>{{ appointment.serviceName }}</h3>
            <p class="business-name">{{ appointment.businessName }}</p>
            <div class="appointment-details">
              <span class="date">{{ formatDate(appointment.date) }}</span>
              <span class="time">{{ appointment.startTime }} - {{ appointment.endTime }}</span>
            </div>
          </div>
          <button class="btn cancel" @click="cancelAppointment(appointment.id)">Lemondás</button>
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

        <button type="submit" class="btn save">Jelszó frissítése</button>
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
      <button class="btn save" @click="updateProfile">Mentés</button>
      <button class="btn delete" @click="deleteProfile">Profil törlése</button>
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
      upcomingAppointments: []
    };
  },
  mounted() {
    const authData = JSON.parse(localStorage.getItem('authData'));
    this.id = authData?.id;
    this.fetchProfile();
    this.fetchUpcomingAppointments(authData.id, authData.tipus);
  },
  methods: {
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
      } catch (error) {
        console.error('Hiba:', error);
        alert('Nem töltődtek be az adatok!');
      }
    },
    async fetchUpcomingAppointments(vallalkozo_id, tipus) {
      try {
        const response = await axios.get(`/api/businesses/bookings?felhasznalo_id=${vallalkozo_id}&tipus=${tipus}`);
        this.upcomingAppointments = response.data || [];
      } catch (error) {
        console.error('Hiba a foglalások betöltésekor:', error);
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
          alert('Foglalás sikeresen lemondva!');
        } catch (error) {
          console.error('Hiba a foglalás lemondásakor:', error);
          alert('Hiba történt a foglalás lemondása közben');
        }
      }
    },
    async updateProfile() {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        alert('Kérlek, töltsd ki az összes mezőt!');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert('Az új jelszavak nem egyeznek!');
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

        alert('Jelszó sikeresen megváltoztatva!');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      } catch (error) {
        alert(`Hiba: ${error.message}`);
      }
    },
    async deleteProfile() {
      alert('Profil törölve!');
    },
    async reset() {
      this.user = JSON.parse(JSON.stringify(this.originalUser));
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.user.profileImage = URL.createObjectURL(file);
      }
    }
  },
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