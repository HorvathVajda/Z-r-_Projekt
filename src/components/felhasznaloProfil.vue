<template>
  <div class="profile-wrapper">
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

    <div class="card">
      <h2>Biztonság</h2>
      <div class="field">
        <label>Jelenlegi jelszó</label>
        <input v-model="currentPassword" type="password" />

        <label>Új jelszó</label>
        <input v-model="newPassword" type="password" />

        <label>Új jelszó megerősítése</label>
        <input v-model="confirmPassword" type="password" />

      </div>
    </div>

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
    };
  },
  mounted() {
    const authData = JSON.parse(localStorage.getItem('authData'));
    console.log('AuthData from localStorage:', authData); // 🚨 Ellenőrizd
    this.id = authData?.id;
    console.log('Felhasználó ID:', this.id); // 🚨 Naplózd az ID-t
    this.fetchProfile();
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
  margin: 40px auto;
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
}
</style>
