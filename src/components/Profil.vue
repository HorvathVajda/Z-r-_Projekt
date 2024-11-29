<template>
  <div class="profil-container">
    <h2>Profil</h2>
    <p>Ez az Ön profilja.</p>
    <p>Email: {{ user.email }}</p>
    <p>Jelszó: *****</p>
    <button @click="editProfile">Profil szerkesztése</button>
  </div>
</template>

<script setup>
import { ref } from "vue";



// Feltételezve, hogy az email-t és egyéb adatokat a localStorage-ból vagy egy API-ból nyerjük
const user = ref({
  email: localStorage.getItem("email") || "Nincs adat",
});

function editProfile() {
  // Profil szerkesztés funkció, pl. átirányítás egy szerkesztő oldalra
  console.log("Profil szerkesztése");
}
</script>

<style scoped>
.profil-container {
  padding: 20px;
  text-align: center;
}
</style>
