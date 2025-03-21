<template>
  <div class="container">
    <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold mb-4">Profil</h2>
      
      <div v-if="!isEditing">
        <img v-if="user.profileImage" :src="user.profileImage" alt="Profilkép" class="w-24 h-24 rounded-full mx-auto mb-4">
        <p><strong>Név:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Telefonszám:</strong> {{ user.phone }}</p>
        <button @click="isEditing = true" class="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Szerkesztés</button>
        <button @click="deleteProfile" class="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Profil törlése</button>
      </div>
      
      <form v-else @submit.prevent="updateProfile">
        <div class="mb-4">
          <label class="block text-gray-700">Név</label>
          <input v-model="user.name" type="text" class="w-full p-2 border rounded">
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700">E-mail</label>
          <input v-model="user.email" type="email" class="w-full p-2 border rounded">
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700">Telefonszám</label>
          <input v-model="user.phone" type="text" class="w-full p-2 border rounded">
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700">Új jelszó</label>
          <input v-model="user.password" type="password" class="w-full p-2 border rounded">
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700">Profilkép</label>
          <input type="file" @change="onFileChange" class="w-full p-2 border rounded">
        </div>
        
        <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Mentés</button>
        <button @click="isEditing = false" type="button" class="mt-2 w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500">Mégse</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isEditing: false,
      user: {
        name: 'Minta Felhasználó',
        email: 'minta@example.com',
        phone: '123-456-7890',
        profileImage: 'https://via.placeholder.com/100',
        password: ''
      }
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      this.user.profileImage = URL.createObjectURL(file);
    },
    async updateProfile() {
      const formData = new FormData();
      formData.append('name', this.user.name);
      formData.append('email', this.user.email);
      formData.append('phone', this.user.phone);
      if (this.user.password) {
        formData.append('password', this.user.password);
      }
      if (this.user.profileImage) {
        formData.append('profileImage', this.user.profileImage);
      }
      
      try {
        await axios.post('http://localhost:5000/api/update-profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Profil sikeresen frissítve!');
        this.isEditing = false;
      } catch (error) {
        console.error('Hiba történt:', error);
        alert('Hiba történt a profil frissítésekor.');
      }
    },
    async deleteProfile() {
      if (confirm('Biztos törli a profilját?')) {
        try {
          await axios.delete('http://localhost:5000/api/delete-profile', {
            data: { email: this.user.email }
          });
          alert('A profil törölve lett.');
          this.$router.push('/');
        } catch (error) {
          console.error('Hiba történt a profil törlésekor:', error);
          alert('Hiba történt a profil törlésekor.');
        }
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  height: 100vh; 
}

button {
  background-color: #6327a2 !important; 
  color: white !important; 
  padding: 12px 16px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); 
}

button:hover {
  background-color: #7a36c1 !important; 
}

.cancel-button {
  background-color: #777 !important; 
}

.cancel-button:hover {
  background-color: #999 !important; 
}
</style>
