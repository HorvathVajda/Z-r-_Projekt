<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Regisztráció</h2>
      <form @submit.prevent="handleRegistration">
        <div class="form-group">
          <label for="name">Név</label>
          <input id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label for="password">Jelszó</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <div class="form-group">
          <label for="phone">Telefonszám</label>
          <input id="phone" v-model="phone" type="tel" required />
        </div>
        <button type="submit" class="register-button">Regisztráció</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      phone: ''
    };
  },
  methods: {
    handleRegistration() {
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone,
      };

      axios.post('http://localhost:5000/api/register', userData)
        .then((response) => {
          console.log('Regisztráció sikeres:', response.data);
          alert(response.data.message);
          this.name = '';
          this.email = '';
          this.password = '';
          this.phone = '';
          this.$router.push('/login');
        })
        .catch((error) => {
          console.error('Regisztráció hiba:', error.response ? error.response.data : error.message);
          alert(error.response?.data?.error || 'Hiba történt a regisztráció során.');
        });
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white; /* Fehér háttér */
  font-family: Arial, sans-serif;
}

.register-card {
  background-color: white;
  border: 3px solid black; /* Fekete szegély */
  padding: 2em;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border-radius: 0.5em;
}

.register-card h2 {
  margin-bottom: 1.5em;
  color: black; /* Fekete szöveg */
  font-weight: bold;
  font-size: 1.8em;
}

.form-group {
  margin-bottom: 1.5em;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5em;
  color: black; /* Fekete szöveg */
}

.form-group input {
  width: 100%;
  padding: 0.8em;
  border: 2px solid black; /* Fekete szegély */
  border-radius: 0.5em;
  font-size: 1em;
  background-color: white; /* Fehér háttér */
  color: black; /* Fekete szöveg */
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: goldenrod; /* Arany kiemelés */
}

.register-button {
  background-color: gold; /* Arany gomb */
  color: black;
  font-size: 1.2em;
  font-weight: bold;
  padding: 0.8em 1.5em;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.register-button:hover {
  background-color: #d4af37; /* Világosabb arany hover */
  transform: scale(1.05); /* Kicsit nagyobb hover effekt */
}

.register-button:active {
  transform: scale(1); /* Visszaállás kattintáskor */
}
</style>
