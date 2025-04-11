<template>
  <header>
    <nav class="navbar" :class="navbarClass">
      <div class="navbar-container">
        <!-- Logo/Brand -->
        <div class="navbar-brand">
          <router-link to="/" class="logo-link">
            <span class="logo-text">bookmytime.</span>
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <button
          class="mobile-menu-button"
          @click="toggleMenu"
          aria-label="Toggle navigation"
        >
          <div class="menu-icon" :class="{ 'open': menuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <!-- Navigation Links -->
        <div class="nav-links" :class="{ 'active': menuOpen }">
          <div class="nav-items">
            <router-link
              v-if="isLoggedIn"
              to="/Foglalas"
              class="nav-item"
              @click="closeMenu"
            >
              <span class="nav-text">Foglalás</span>
              <span class="nav-hover"></span>
            </router-link>
            <router-link
              v-if="vallalkozo"
              to="/vallalkozoHome"
              class="nav-item"
              @click="closeMenu"
            >
              <span class="nav-text">Vállalkozásaim</span>
              <span class="nav-hover"></span>
            </router-link>

            <router-link
              v-if="felhasznalo"
              to="/felhasznaloHome/Profil"
              class="nav-item"
              @click="closeMenu"
            >
              <span class="nav-text">Profil</span>
              <span class="nav-hover"></span>
            </router-link>

            <router-link
              v-if="vallalkozo"
              to="/vallalkozoHome/Profil"
              class="nav-item"
              @click="closeMenu"
            >
              <span class="nav-text">Profil</span>
              <span class="nav-hover"></span>
            </router-link>

            <router-link
              v-if="!isLoggedIn"
              to="/login"
              class="nav-item"
              @click="closeMenu"
            >
              <span class="nav-text">Bejelentkezés</span>
              <span class="nav-hover"></span>
            </router-link>

            <a
              v-if="isLoggedIn"
              href="#"
              class="nav-item"
              @click="handleLogout"
            >
              <span class="nav-text">Kijelentkezés</span>
              <span class="nav-hover"></span>
            </a>
          </div>
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
const vallalkozo = computed(() => store.vallalkozo);
const felhasznalo = computed(() => store.felhasznalo);
const navbarClass = ref("normal-navbar");
const menuOpen = ref(false);

function handleLogout() {
  store.clearAuthData();
  router.push("/login");
  closeMenu();
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

onMounted(() => {
  const handleScroll = () => {
    if (window.scrollY > 5) {
      navbarClass.value = "scrolled-navbar";
    } else {
      navbarClass.value = "normal-navbar";
    }
  };

  window.addEventListener("scroll", handleScroll);

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  height: 80px;
  display: flex;
  align-items: center;
  background-color: transparent;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.navbar.scrolled-navbar {
  height: 70px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  background-color: white;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.navbar-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;
  transition: all 0.3s ease;
}

.logo-text {
  font-family: 'SoraSemiBold', sans-serif;
  font-size: 1.8rem;
  transition: all 0.3s ease;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.menu-icon {
  width: 24px;
  height: 24px;
  position: relative;
  transform: rotate(0deg);
  transition: all 0.3s ease;
}

.menu-icon span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: black;
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: all 0.3s ease;
}

.menu-icon span:nth-child(1) {
  top: 4px;
}

.menu-icon span:nth-child(2) {
  top: 11px;
}

.menu-icon span:nth-child(3) {
  top: 18px;
}

.menu-icon.open span:nth-child(1) {
  top: 11px;
  transform: rotate(135deg);
}

.menu-icon.open span:nth-child(2) {
  opacity: 0;
  left: -24px;
}

.menu-icon.open span:nth-child(3) {
  top: 11px;
  transform: rotate(-135deg);
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-items {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-item {
  position: relative;
  text-decoration: none;
  color: black;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.nav-text {
  position: relative;
  z-index: 1;
  font-weight: 600;
}

.nav-hover {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: black;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-hover {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-item:hover {
  color: black;
}

/* Mobile styles */
@media (max-width: 768px) {
  .navbar {
    height: 70px;
    padding: 0 1rem;
  }

  .navbar-container {
    padding: 0 1rem;
  }

  .mobile-menu-button {
    display: block;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 300px;
    height: 100vh;
    background-color: white;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    padding: 6rem 2rem 2rem;
    z-index: 1000;
  }

  .nav-links.active {
    transform: translateX(0);
  }

  .nav-items {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }

  .nav-item {
    font-size: 1.2rem;
    padding: 0.5rem 0;
  }

  .scrolled-navbar {
    height: 70px;
  }
}

/* Animation for mobile menu */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-links.active .nav-item {
  animation: fadeIn 0.3s ease forwards;
}

.nav-links.active .nav-item:nth-child(1) {
  animation-delay: 0.1s;
}

.nav-links.active .nav-item:nth-child(2) {
  animation-delay: 0.2s;
}

.nav-links.active .nav-item:nth-child(3) {
  animation-delay: 0.3s;
}

.nav-links.active .nav-item:nth-child(4) {
  animation-delay: 0.4s;
}
</style>