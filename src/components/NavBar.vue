<template>
  <header>
    <nav class="navbar" :class="navbarClass">
      <div class="navbar-container">
        <!-- Logo/Brand -->
        <div class="navbar-brand">
          <router-link to="/" class="logo-link">
            <span class="logo-text">bookyourtime.</span>
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
              to="/felhasznaloHome"
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
:root {
  --primary-color: #6B00D0;
  --primary-light: #9A32CD;
  --text-dark: #2D3748;
  --text-light: #718096;
  --bg-white: #FFFFFF;
  --bg-light: #F8F9FA;
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
@font-face {
  font-family: 'SoraSemiBold';
  src: url('@/assets/fonts/Sora-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
}

.logo-text {
  font-family: 'SoraSemiBold', sans-serif;
  font-size: 30 px;
  font-weight: normal; /* vagy hagyd ki, mert a font már félkövér */
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
  height: 80px;
  display: flex;
  align-items: center;
}

.navbar.scrolled-navbar {
  box-shadow: var(--shadow-md);
  height: 70px;
  backdrop-filter: blur(5px);
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
  font-weight: 700;
  font-size: 1.8rem;
  color: var(--text-dark);
  transition: var(--transition);
}

.logo-text {
  transition: var(--transition);
}

.logo-dot {
  color: var(--primary-color);
  transition: var(--transition);
}

.logo-link:hover .logo-text {
  color: var(--primary-color);
}

.logo-link:hover .logo-dot {
  transform: scale(1.2);
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
  transition: var(--transition);
}

.menu-icon span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: var(--text-dark);
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: var(--transition);
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
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  position: relative;
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 0;
  transition: var(--transition);
  overflow: hidden;
}

.nav-text {
  position: relative;
  z-index: 1;
  font-weight: bold;
}

.nav-hover {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-hover {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-item:hover {
  color: var(--primary-color);
}

/* Mobile styles */
@media (max-width: 768px) {
  .navbar {
    height: 70px;
  }

  .navbar-container {
    padding: 0 1.5rem;
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
    background-color: var(--bg-white);
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
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
    gap: 1.5rem;
  }

  .nav-item {
    font-size: 1.2rem;
    padding: 0.5rem 0;
  }

  .scrolled-navbar {
    height: 70px;
  }
}
</style>