<template>
  <div class="profile-wrapper">
    <div class="card">
      <div class="profile-summary">
        <div class="avatar-wrapper">
          <img v-if="user.profileImage" :src="user.profileImage" alt="Profilkép" class="avatar" />
          <div class="avatar-placeholder" v-else>👤</div>
        </div>
        <div class="user-info">
          <h2>{{ user.name }}</h2>
          <p>{{ user.email }}</p>
        </div>
      </div>

      <h2>Személyes adatok</h2>

      <div class="field">
        <label>Név</label>
        <input v-model="user.name" type="text" />
      </div>
      <div class="field">
        <label>Email</label>
        <input v-model="user.email" type="email" />
      </div>
      <div class="field">
        <label>Telefonszám</label>
        <input v-model="user.phone" type="text" />
      </div>
    </div>

    <div class="card">
      <h2>Biztonság</h2>
      <div class="field">
        <label>Jelenlegi jelszó</label>
        <input v-model="user.password" type="password" />
        <label>Új jelszó</label>
        <input v-model="user.password" type="password" />
        <label>Új jelszó</label>
        <input v-model="user.password" type="password" />
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
export default {
  data() {
    return {
      user: {
        name: 'Teszt Elek',
        email: 'teszt@pelda.hu',
        phone: '123456789',
        password: '',
        profileImage: ''
      },
      originalUser: {}
    };
  },
  mounted() {
    this.originalUser = JSON.parse(JSON.stringify(this.user));
  },
  methods: {
    updateProfile() {
      alert('Profil frissítve!');
    },
    deleteProfile() {
      alert('Profil törölve!');
    },
    reset() {
      this.user = JSON.parse(JSON.stringify(this.originalUser));
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.user.profileImage = URL.createObjectURL(file);
      }
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
