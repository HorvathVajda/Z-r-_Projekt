<template>
  <div class="container-fluid d-flex p-0 m-0 min-vh-100">
    <div class="left-col d-flex justify-content-center align-items-center">
      <div class="register-form">
        <h2>Regisztráció</h2>
        <form @submit.prevent="handleRegistration">
          <div class="form-group">
            <label for="name">Név</label>
            <input
              id="name"
              v-model="name"
              required
              placeholder="*Teljes név"
            />
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="*E-mail cím"
            />
          </div>
          <div class="form-group">
            <label for="password">Jelszó</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="*Jelszó"
            />
            <div v-if="password && passwordStrength !== 'strong'" class="password-strength">
              <p v-if="password.length < 8">Jelszónak legalább 8 karakternek kell lennie.</p>
              <p v-if="!/[a-z]/.test(password)">Jelszónak kisbetűt kell tartalmaznia.</p>
              <p v-if="!/[A-Z]/.test(password)">Jelszónak nagybetűt kell tartalmaznia.</p>
              <p v-if="!/[0-9]/.test(password)">Jelszónak számot kell tartalmaznia.</p>
            </div>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Jelszó megerősítése</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="*Jelszó megerősítése"
            />
            <p v-if="confirmPassword && confirmPassword !== password" class="error-message">
              A két jelszó nem egyezik!
            </p>
          </div>
          <div class="form-group">
            <label for="phone">Telefonszám</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              required
              placeholder="*Telefonszám"
            />
            <p v-if="phone && !phone.match(/^\+?(\d{1,3})?(\d{8})$/)" class="error-message">
              Kérjük, érvényes telefonszámot adjon meg!
            </p>
          </div>
          <div class="form-group checkbox-group">
            <input type="checkbox" id="terms" v-model="termsAccepted" />
            <label for="terms">
              <span>Elfogadom az</span>
              <a href="/Adatvedelem" target="_blank">ÁSZF-et</a>
            </label>
          </div>

          <button type="submit" class="register-button" :disabled="!isFormValid || !termsAccepted">
            Regisztráció
          </button>
        </form>
      </div>
    </div>
    <div class="right-col">
      <div class="image-container">
        <img src="/foto.jpg" alt="Regisztráció háttér" />
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
        tipus: 'felhasznalo',
      };

      axios.post('http://localhost:5000/api/auth/register-vallalkozo', userData)
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  overflow: hidden;
}

.container-fluid {
  display: flex;
  height: 100vh;
  padding: 0;
  margin: 0;
}

.left-col, .right-col {
  height: 100%;
  flex: 1;
}

.left-col {
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h2 {
  font-size: 2rem;
  color: #6327A2;
  margin-bottom: 1.5rem;
}

.form-group {
  text-align: left;
}

.form-group label {
  font-weight: bold;
  color: #6327A2;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #ffffff;
  color: #333;
  margin-bottom: 1.5rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  border-color: #ff8c00;
  box-shadow: 0 0 8px rgba(255, 140, 0, 0.3);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 7px;
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0;
  padding: 0;
  vertical-align: middle;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #6327A2;
  gap: 4px; /* Kisebb térköz a szövegrészek között */
}

.checkbox-group a {
  color: #6327A2;
  text-decoration: none;
}

.checkbox-group a:hover {
  text-decoration: underline;
  background: transparent;
}


.register-button {
  background-color: #5a3472;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s, transform 0.3s;
}

.register-button:hover {
  transform: translateY(-2px);
}

.register-button:active {
  transform: translateY(0);
}

.error-message {
  color: red;
  font-size: 0.9rem;
}

.right-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-col .image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.right-col .image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .left-col {
    padding: 20px;
  }
  .register-form {
    padding: 1rem;
    width: 100%;
  }
}
</style>
