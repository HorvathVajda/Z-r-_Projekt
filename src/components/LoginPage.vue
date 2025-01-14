<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ $store.isLoggedIn ? "Kijelentkezés" : "Bejelentkezés" }}</h2>
      <form @submit.prevent="handleLogin" v-if="!$store.isLoggedIn">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Adja meg az e-mail címét"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Jelszó</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Adja meg a jelszavát"
            required
          />
        </div>
        <button type="submit" class="login-button">Bejelentkezés</button>
        <router-link class="nav-link" to="/registerChoose" style="padding-top: 5px;">Regisztráció</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { login } from "../API"; // Importáljuk a login API hívást

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
        try {
    const response = await login({
      email: this.email,
      jelszo: this.password,
    });

    const token = response.data.token;

    // Token mentése lejárati idővel
    const expirationTime = Date.now() + 3600 * 1000;
    const authData = JSON.stringify({ token, email: this.email, expirationTime });

    localStorage.setItem("authData", authData);

    this.$store.isLoggedIn = true;
    this.$router.push("/"); // Átirányítás a főoldalra
  } catch (error) {
    this.errorMessage = error.response?.data?.message || "Hiba történt a bejelentkezés során";
    alert(this.errorMessage);
  }
},
  },
};
</script>

<style scoped>
/* Általános stílusok */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/path/to/your/image.jpg') no-repeat center center fixed; /* Helyezd ide a háttérkép URL-jét */
  background-size: cover;
  position: relative;
}

.login-card {
  background-color: rgba(255, 255, 255, 0.8); /* Fehér háttér átlátszóval */
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  border-color: rgb(219, 190, 21); /* Kék szín fókuszáláskor */
  box-shadow: 0 0 10px rgba(108, 92, 247, 0.2); /* Fókusz effekt */
}

.login-button {
  background-color: gold; /* Modern kék szín */
  color: black;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s, transform 0.3s;
}

.login-button:hover {
  background-color: gold; /* Sötétebb kék hover */
  transform: translateY(-2px); /* Enyhe emelkedés */
}

.login-button:active {
  background-color: rgba(255, 217, 0, 0.781); /* Még sötétebb szín kattintáskor */
  transform: translateY(0);
}

.nav-link {
  color: black;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 10px;
  display: inline-block;
}

.nav-link:hover {
  text-decoration: underline;
}

</style>
