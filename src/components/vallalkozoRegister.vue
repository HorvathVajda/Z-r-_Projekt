<template>
  <div class="main-container">
    <nav class="navbar">
      <!-- Ide kerül a navbar tartalma -->
    </nav>
    <div class="register-container">
      <div class="register-card">
        <h2>Regisztráció</h2>
        <form @submit.prevent="handleRegistration">
          <!-- Űrlap mezők itt -->
        </form>
      </div>
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
      confirmPassword: '',
      phone: '',
      termsAccepted: false,
      formSubmitted: false,
    };
  },
  computed: {
    passwordStrength() {
      const password = this.password;
      if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        return 'strong';
      }
      return 'weak';
    },
    isFormValid() {
      return (
        this.name &&
        this.email &&
        this.password === this.confirmPassword &&
        this.passwordStrength === 'strong' &&
        this.phone.match(/^\+?(\d{1,3})?(\d{8})$/)
      );
    },
  },
  methods: {
    handleRegistration() {
      this.formSubmitted = true;
      if (!this.isFormValid || !this.termsAccepted) {
        alert('Kérjük, töltse ki helyesen az összes mezőt és fogadja el az ÁSZF-et!');
        return;
      }

      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone,
        tipus: 'vallalkozo',
      };

      axios.post('http://localhost:5000/api/auth/register', userData)
  .then((response) => {
    console.log('Regisztráció sikeres:', response.data);
    alert(response.data.message);
    this.$router.push('/login');
  })
  .catch((error) => {
    console.error('Regisztráció hiba:', error.response?.data || error.message);
    alert(error.response?.data?.error || 'Hiba történt a regisztráció során.');
  });

    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: white;
  padding: 10px 0;
  text-align: center;
  z-index: 1000; /* A navbar legyen mindig a tartalom felett */
}

.register-container {
  margin-top: 70px; /* A navbar magassága, hogy a tartalom ne érintkezzen vele */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
}

.register-card {
  background-color: white;
  border: 3px solid black;
  padding: 2em;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border-radius: 0.5em;
}

.register-card h2 {
  margin-bottom: 1.5em;
  color: black;
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
  color: black;
}

.form-group input {
  width: 100%;
  padding: 0.8em;
  border: 2px solid black;
  border-radius: 0.5em;
  font-size: 1em;
  background-color: white;
  color: black;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: goldenrod;
}

.register-button {
  background-color: gold;
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
  background-color: #d4af37;
  transform: scale(1.05);
}

.register-button:active {
  transform: scale(1);
}
</style>
