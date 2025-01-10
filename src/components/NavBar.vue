<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <router-link class="navbar-brand logo" to="/">BookMyTime</router-link>

        <!-- Hamburger menü gomb -->
        <button
          class="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="toggleMenu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigációs menü -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" @click="toggleMenu">Főoldal</router-link>
            </li>
            <li class="nav-item">
              <router-link v-if="isLoggedIn" class="nav-link" to="/Profil" @click="toggleMenu">
                Profil
              </router-link>
            </li>
            <li class="nav-item">
              <router-link

                class="nav-link login-link"
                to="/login"
                @click="toggleMenu"
              >
                Bejelentkezés
              </router-link>
              <router-link
                v-if="isLoggedIn"
                class="nav-link login-link"
                to="/login"
                @click="handleLogout"
              >
                Kijelentkezés
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { store } from "../store";

const router = useRouter();
const isLoggedIn = computed(() => store.isLoggedIn);

function handleLogout() {
  store.clearAuthData();
  router.push("/login");
}

function toggleMenu() {
  const navbar = document.querySelector("#navbarNav");
  if (navbar) {
    navbar.classList.toggle("show");
  }
}
</script>


<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.navbar {
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  padding: 10px 0;
  text-align: center;
  font-family: 'Franklin Gothic Medium';
  height: auto;
  transition: transform 0.3s ease-in-out;
}

.navbar-nav{
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navbar.hidden {
  transform: translateY(-100%);
}

.navbar-toggler {
  padding: 8px 12px;
  position: fixed;
  right: 20px;
  top: 10px;
  z-index: 1050;
  transition: background-color 0.3s, border-color 0.3s;
}

.navbar-toggler:hover {
  background: goldenrod;
}

.collapse.navbar-collapse {
  top: 0;
  left: 0;
  background: white;
  height: auto;
  width: auto;
  transition: transform 0.3s ease-in-out;
  z-index: 1040;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath stroke='black' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
  width: 20px;
  height: 20px;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: goldenrod;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.nav-link.active.login-link::after {
  transform: scaleX(0);
}

.container-fluid {
  width: 100%;
  padding: auto;
  margin: auto;
}

.logo {
  font-size: 30px;
  font-weight: bold;
  color: black;
  text-decoration: none;
  background: transparent;
}

.logo:hover {
  color: goldenrod;
}

.nav-link {
  color: black;
  text-decoration: none;
  background: transparent;
  font-size: 18px;
  padding: 10px 15px;
  position: relative;
  display: inline-block;
  transition: color 0.3s, background-color 0.3s;
  margin-right: 20px;
}

.nav-link:hover {
  color: goldenrod;
  background: transparent;
}

.nav-link.active {
  background-color: gold;
  color: black;
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
}

.nav-link.active:hover {
  background-color: goldenrod;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: goldenrod;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.navbar .nav-link.active {
  padding: 10px 15px;
}

@media (max-width: 768px) {
  .navbar-nav {
    flex-direction: column;
    align-items: center;
  }
}
</style>
