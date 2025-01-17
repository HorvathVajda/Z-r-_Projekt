<template>
  <div>
    <labelcet v-if="!isRegistrationPage" />

    <div class="container-fluid d-flex p-0 m-0 min-vh-100">
      <div class="left-col d-flex justify-content-center align-items-center">
        <div class="content text-center">
          <h1>Válassza ki a regisztráció típusát</h1>
          <button class="gold-button" @click="redirectToBusinessRegistration">
            Vállalkozóként regisztrálok
          </button>
          <button class="gold-button" @click="redirectToClientRegistration">
            Ügyfélként regisztrálok
          </button>
        </div>
      </div>
      <div class="right-col">
        <div class="image-container">
          <img src="/foto.jpg" alt="Regisztráció kép" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const isRegistrationPage = ref(false);

if (router.currentRoute.value.name === 'registerChoose') {
  isRegistrationPage.value = true;
}

function redirectToBusinessRegistration() {
  router.push('/vallalkozoRegister');
}

function redirectToClientRegistration() {
  router.push('/register');
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
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content h1 {
  font-size: 48px;
  font-weight: bold;
  color: #6327A2;
  margin-bottom: 20px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.gold-button {
  display: block;
  margin: 15px 0;
  padding: 10px 30px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #f9a602, #d6a307);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.gold-button:hover {
  transform: scale(1.);
  box-shadow: 0 10px 20px rgba(217, 175, 55, 0.6);
}

.gold-button:active {
  transform: scale(1);
  box-shadow: 0 6px 15px rgba(217, 175, 55, 0.8);
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
  object-fit: cover; /* Ensures the image covers the whole area */
  border-radius: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .left-col {
    padding: 20px;
  }
  .content h1 {
    font-size: 36px;
  }
  .gold-button {
    font-size: 18px;
    padding: 15px 30px;
  }
}

</style>
