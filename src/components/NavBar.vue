<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <!-- Logo, amire kattintva a felhasználó visszakerül a főoldalra -->
        <router-link class="navbar-brand logo" to="/" @click="closeMenu">BookMyTime</router-link>

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
            <!-- Navigációs linkek a megfelelő útvonalakhoz -->
            <li class="nav-item">
              <router-link class="nav-link" to="/" @click="toggleMenu">Főoldal</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/kapcsolat" @click="toggleMenu">Kapcsolat</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/rolunk" @click="toggleMenu">Rólunk</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link active login-link" to="/login" @click="toggleMenu">Bejelentkezés</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
function toggleMenu() {
  const navbar = document.querySelector('#navbarNav');
  if (navbar) {
    navbar.classList.toggle('show');
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: white;
  padding: 10px 0;
  text-align: center;
  font-family: 'Franklin Gothic Medium';
  height: 50px;
  transition: transform 0.3s ease-in-out;
}

.navbar.hidden {
  transform: translateY(-100%);
}

.navbar-toggler {
  background: white;
  padding: 8px 12px;
  position: absolute;
  right: 20px;
  top: 10px;
  z-index: 1050;
  transition: background-color 0.3s, border-color 0.3s;
}

.navbar-toggler:hover {
  background: goldenrod;
}

.collapse.navbar-collapse {
  position: fixed;
  right: 0;
  height: auto;
  width: auto;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  z-index: 1040;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath stroke='black' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
  width: 20px;
  height: 20px;
}


/* Az aktív linkeknél, de nem a Bejelentkezés linknél */
.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px; /* Alsó szegély vastagsága */
  background-color: goldenrod; /* Arany szín */
  transform: scaleX(0); /* Az aktív linkeknél csak akkor jelenjen meg, ha nem a Bejelentkezés gomb */
  transition: transform 0.3s ease-in-out;
}

/* Kivétel a Bejelentkezés gombra */
.nav-link.active.login-link::after {
  transform: scaleX(0); /* A Bejelentkezés gombnál nem jelenik meg a szegély */
}

.container-fluid {
  width: 100%;   /* Ezt is biztosítjuk */
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

/* Alsó szegély az aktív linkekhez */
.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px; /* Alsó szegély vastagsága */
  background-color: goldenrod; /* Arany szín */
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.nav-link:hover::after {
  transform: scaleX(1); /* A szegély megjelenik hover hatására */
}

/* Törlés az aktív link extra padding-jából */
.navbar .nav-link.active {
  padding: 10px 15px;
}

</style>
