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
        <router-link class="nav-link" to="/register" style="padding-top: 5px;">Regisztráció</router-link>
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
      errorMessage: "", // Hibaüzenet
    };
  },
  methods: {
    async handleLogin() {
  try {
    const response = await login({
      email: this.email,
      jelszo: this.password,
    });

    // A válaszban kapott token tárolása localStorage-ban
    const token = response.data.token;

    // A token tárolásakor beágyazzuk az emailt
    const tokenWithEmail = JSON.stringify({ token, email: this.email });

    // Mentés a localStorage-ba
    localStorage.setItem("authData", tokenWithEmail);

    // A store frissítése
    this.$store.isLoggedIn = true;

    // Átirányítás a főoldalra
    this.$router.push("/");
  } catch (error) {
    this.errorMessage = error.response?.data?.message || "Hiba történt a bejelentkezés során";
    alert(this.errorMessage);
  }
},
  },
};
</script>

<style scoped>
.nav-link {
  color: black;
  background: transparent;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white; /* Fehér háttér */
  font-family: Arial, sans-serif;
}

.login-card {
  background-color: white;
  border: 3px solid black; /* Fekete szegély */
  padding: 2em;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border-radius: 0.5em;
}

.login-card h2 {
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

.login-button {
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

.login-button:hover {
  background-color: #d4af37; /* Világosabb arany hover */
  transform: scale(1.05); /* Kicsit nagyobb hover effekt */
}

.login-button:active {
  transform: scale(1); /* Visszaállás kattintáskor */
}
</style>
