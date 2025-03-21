<template>
  <header>
    <nav class="navbar navbar-expand-lg" :class="navbarClass">
      <div class="container-fluid">
        <a
          class="navbar-brand logo"
          href="/">BookMyTime
        </a>

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
                v-if="vallalkozo"
                class="nav-link login-link"
                href="/vallalkozoHome"
                @click="toggleMenu"
              >
                Vállalkozásaim
              </a>
              <a
                v-if="felhasznalo"
                class="nav-link login-link"
                href="/felhasznaloHome"
                @click="toggleMenu"
              >
                Profil
              </a>
            </li>
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
const vallalkozo = computed(() => store.vallalkozo);
const felhasznalo = computed(() => store.felhasznalo);
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
  background: #fff; /* Simán fehér háttér */
  position: sticky; /* Sticky navbar, marad a képernyő tetején görgetéskor */
  top: 0; /* A navbar mindig a képernyő tetején lesz */
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Franklin Gothic Medium';
  height: 70px; /* Fix magasság */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Alsó árnyék */
  border-radius: 0; /* Nincs lekerekített sarkak */
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* További stílusok maradnak ugyanazok, ahogyan korábban */

.navbar.normal-navbar {
  top: 0;
}

.navbar-brand.logo {
  font-size: 40px;
  font-weight: bold;
  text-decoration: none;
  color: black;
  margin: 0;
  padding: 0;
  line-height: 60px;
  transition: color 0.3s;
  background: transparent;
}

.navbar-brand.logo:hover {
  color: #6B00D0;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
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
  background: #6B00D0;
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
}

.nav-link {
  color: black;
  text-decoration: none;
  font-size: 23px;
  padding: 0 15px;
  position: relative;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #6B00D0;
  background: transparent;
}

.nav-link.active {
  background-color: #00CED1;
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
  background-color: #6B00D0;
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
    width: 100%;
    padding: 10px 0;
  }

  .navbar-toggler {
    display: block;
  }

  .navbar-toggler-icon::before,
  .navbar-toggler-icon::after {
    width: 24px;
  }

  .collapse.navbar-collapse {
    display: none;
    width: 100%;
  }

  .collapse.navbar-collapse.show {
    display: block;
  }
}
</style>
