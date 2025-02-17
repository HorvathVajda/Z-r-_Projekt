<template>
  <header>
    <nav class="navbar navbar-expand-lg" :class="navbarClass">
      <div class="container-fluid">
        <a class="navbar-brand logo" href="/">BookMyTime</a>

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
              <a
                v-if="!isLoggedIn"
                class="nav-link login-link"
                href="/login"
                @click="toggleMenu"
              >
                Bejelentkezés
              </a>
              <a
                v-if="isLoggedIn"
                class="nav-link login-link"
                href="/login"
                @click="handleLogout"
              >
                Kijelentkezés
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { store } from "../store";

const router = useRouter();
const isLoggedIn = computed(() => store.isLoggedIn);
const navbarClass = ref("normal-navbar");

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

// Scroll event handler to add margin-top to the navbar
onMounted(() => {
  const handleScroll = () => {
    if (window.scrollY > 5) {
      navbarClass.value = "scrolled-navbar";
    } else {
      navbarClass.value = "normal-navbar";
    }
  };

  window.addEventListener("scroll", handleScroll);

  // Cleanup event listener when the component is destroyed
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.navbar {
  background: rgba(255, 255, 255, 0.7); /* Félig átlátszó fehér háttér */
  backdrop-filter: blur(10px); /* Elmosás effekt */
  position: fixed;
  left: 0;
  right: 0;
  width: 99%; /* Kisebb szélesség */
  z-index: 1000;
  padding: 0 20px; /* Csökkentett padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Franklin Gothic Medium';
  height: 70px; /* Fix magasság */
  transition: top 0.3s ease-in-out, background 0.3s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Enyhe árnyék */
  border-radius: 25px; /* Lekerekített sarkak */
  margin-top: 5px;
  left: 50%; /* A navbar bal széle a képernyő közepére kerül */
  transform: translateX(-50%); /* A navbar középre igazítása */
}


.navbar.normal-navbar {
  top: 0; /* Alapértelmezett top */
}

.navbar.scrolled-navbar {
  top: 20px; /* Görgetéskor megnövelt top */
}

.navbar-brand.logo {
  font-size: 40px; /* Betűméret */
  font-weight: bold; /* Félkövér szöveg */
  text-decoration: none; /* Aláhúzás eltávolítása */
  color: #6327A2; /* Szöveg színe */
  margin: 0; /* Margin eltávolítása */
  padding: 0; /* Padding eltávolítása */
  line-height: 60px; /* Az elem középre igazítása a navbar magasságával */
  transition: color 0.3s; /* Színváltozás animáció */
}

.navbar-brand.logo:hover {
  color: #9d9ff4; /* Hover szín */
  background: transparent;
}

.navbar-nav {
  display: flex;
  flex-direction: row; /* Sorba rendezi az elemeket */
  align-items: center; /* Középre igazítja őket függőlegesen */
  gap: 20px; /* Elemenkénti távolság */
  margin: 0;
  padding: 0;
  list-style: none; /* Lista stílus eltávolítása */
}

.navbar-toggler {
  padding: 8px 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.navbar-toggler:hover {
  background: #6F4868;
  color: white;
}

.navbar-toggler-icon {
  width: 24px;
  height: 2px;
  background-color: black;
  position: relative;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: "";
  position: absolute;
  left: 0;
  width: 24px;
  height: 2px;
  background-color: black;
  transition: transform 0.3s;
}

.navbar-toggler-icon::before {
  top: -8px;
}

.navbar-toggler-icon::after {
  top: 8px;
}

.nav-link {
  color: #6327A2;
  text-decoration: none;
  font-size: 23px;
  padding: 0 15px; /* Csökkentett padding */
  position: relative;
  transition: color 0.3s, background-color 0.3s;
}

.nav-link:hover {
  color: #9d9ff4;
  background: transparent;
}

.nav-link.active {
  background-color: 00CED1;
  color: black;
  border-radius: 5px;
  padding: 5px 10px;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #9d9ff4;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.nav-link:hover::after {
  transform: scaleX(1);
}

/* Mobilnézet */
@media (max-width: 768px) {
  .navbar-nav {
    flex-direction: column;
    align-items: center;
  }
}
</style>
