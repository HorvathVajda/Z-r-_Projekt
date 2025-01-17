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
        <router-link class="nav-link" to="/registerChoose">Regisztráció</router-link>
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

        const { token, expirationTime, tipus } = response.data;

        // Token mentése lejárati idővel
        const authData = {
          token,
          email: this.email,
          expirationTime,
          tipus,
        };

        this.$store.updateAuthData(authData);

        if (tipus == "vallalkozo") {
          this.$router.push("/vallalkozoHome");
        } else {
          this.$router.push("/");
        }

      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Hiba történt a bejelentkezés során";
        alert(this.errorMessage);
      }
    },
  },
};
</script>

<style scoped>
/* Alap stílusok */
body {
  margin: 0;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  background-color: #1a1a1a;
}

/* Központi container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/path/to/your/image.jpg') no-repeat center center fixed; /* Helyezd ide a háttérképet */
  background-size: cover;
  position: relative;
}

/* Kártya háttér */
.login-card {
  background-color: rgba(0, 0, 0, 0.7); /* Sötét háttér */
  color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  backdrop-filter: blur(8px); /* Homályos háttér */
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ff8c00; /* Narancssárga szín */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  font-weight: bold;
  color: #fff;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #2c2c2c;
  color: #f5f5f5;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  border-color: #ff8c00; /* Narancssárga fókusz */
  box-shadow: 0 0 8px rgba(255, 140, 0, 0.3); /* Narancssárga fókusz effekt */
}

.login-button {
  background-color: #ff8c00; /* Narancssárga */
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

.login-button:hover {
  background-color: #e67e00; /* Sötétebb narancssárga */
  transform: translateY(-2px);
}

.login-button:active {
  background-color: #c87c00; /* Még sötétebb narancssárga */
  transform: translateY(0);
}

.nav-link {
  color: #ff8c00;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 10px;
  display: inline-block;
}

.nav-link:hover {
  text-decoration: underline;
}
</style>
