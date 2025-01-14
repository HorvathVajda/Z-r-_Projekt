<template>
  <div class="profil-container">
    <h2>Profil</h2>
    <p>Ez az Ön profilja.</p>
    <p>Email: {{ user }}</p>
    <p>Jelszó: *****</p>
        <router-link class="szerkesztesGomb" to="/editprofile">Profil szerkesztése</router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";

// authData JSON feldolgozása a localStorage-ból
let user = "Nincs megadva email";

const authData = localStorage.getItem("authData");
if (authData) {
  try {
    const parsedData = JSON.parse(authData);
    user = parsedData.email || "Nincs megadva email";
  } catch (error) {
    console.error("Hiba az authData feldolgozásakor:", error);
  }
}

function editProfile() {

}
</script>

<style scoped>
.profil-container {
  padding: 20px;
  text-align: center;
}

.szerkesztesGomb{
  text-decoration: none;
  background-color: gold;
  color: black;
  padding: 0.8em 1.5em;
  border: none;
  border-radius: 0.5em;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}
.szerkesztesGomb:hover{
  background-color: goldenrod;
}
</style>
