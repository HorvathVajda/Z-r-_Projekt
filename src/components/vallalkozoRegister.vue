<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Regisztráció</h2>
      <form @submit.prevent="handleRegistration">
        <input type="hidden" name="tipus" value="vallalkozo" />
        <div class="form-group">
          <label for="name">Név</label>
          <input id="name" v-model="name" required placeholder="*Teljes név"/>
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" required placeholder="*E-mail cím"/>
        </div>
        <div class="form-group">
          <label for="password">Jelszó</label>
          <input id="password" v-model="password" type="password" required placeholder="*Jelszó" />
          <div v-if="password && passwordStrength !== 'strong'" class="password-strength">
            <p v-if="password.length < 8">Jelszónak legalább 8 karakternek kell lennie.</p>
            <p v-if="!/[a-z]/.test(password)">Jelszónak kisbetűt kell tartalmaznia.</p>
            <p v-if="!/[A-Z]/.test(password)">Jelszónak nagybetűt kell tartalmaznia.</p>
            <p v-if="!/[0-9]/.test(password)">Jelszónak számot kell tartalmaznia.</p>
          </div>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Jelszó megerősítése</label>
          <input id="confirmPassword" v-model="confirmPassword" type="password" required placeholder="*Jelszó megerősítése" />
          <p v-if="confirmPassword && confirmPassword !== password" class="error-message">A két jelszó nem egyezik!</p>
        </div>
        <div class="form-group">
          <label for="phone">Telefonszám</label>
          <input id="phone" v-model="phone" type="tel" required placeholder="*Telefonszám" />
          <p v-if="phone && !phone.match(/^\+?(\d{1,3})?(\d{8})$/)" class="error-message">Kérjük, érvényes telefonszámot adjon meg!</p>
        </div>
        <div class="form-group">
          <input type="checkbox" id="terms" v-model="termsAccepted" />
          <label for="terms">
            Elfogadom az <a href="/Adatvedelem" target="_blank">ÁSZF-et</a>
          </label>
          <p v-if="!termsAccepted && formSubmitted" class="error-message">Az ÁSZF-et el kell fogadni a regisztrációhoz!</p>
        </div>
        <button type="submit" class="register-button" :disabled="!isFormValid || !termsAccepted">Regisztráció</button>
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
