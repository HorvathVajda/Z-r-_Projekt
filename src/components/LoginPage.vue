<template>
  <div class="container-fluid d-flex p-0 m-0 min-vh-100">
    <div class="left-col d-flex justify-content-center align-items-center">
      <div class="login-form">
        <h2>Bejelentkezés</h2>
        <form @submit.prevent="handleLogin">
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
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <router-link class="nav-link" to="/registerChoose">Regisztráció</router-link>
        </form>
      </div>
    </div>
    <div class="right-col">
      <div class="image-container">
        <img src="/foto.jpg" alt="Bejelentkezés háttér" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      jelszo: password.value,
    });

    const { token, expirationTime, tipus, id } = response.data;

    const authData = {
      token,
      email: email.value,
      expirationTime,
      tipus,
      id // Tároljuk el az id-t is
    };

    console.log("authData to be stored:", authData);  // Ellenőrzés

    // Auth adatok tárolása localStorage-ban
    localStorage.setItem('authData', JSON.stringify(authData));

    // Átirányítás a megfelelő oldalra
    if (tipus === "vallalkozo") {
      router.push("/vallalkozoHome");
    } else {
      router.push("/");
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Hiba történt a bejelentkezés során.";
  }
}
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

.login-form {
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

.login-button {
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

.login-button:hover {
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}

.nav-link {
  color: #6327A2;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 10px;
}

.nav-link:hover {
  text-decoration: underline;
  background: transparent;
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
  .login-form {
    padding: 1rem;
    width: 100%;
  }
  .content h1 {
    font-size: 36px;
  }
}
</style>
