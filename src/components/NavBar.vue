<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <!-- Logo, amire kattintva a felhasználó visszakerül a főoldalra -->
        <router-link class="navbar-brand logo" to="/">BookMyTime</router-link>

        <!-- Hamburger menü gomb -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigációs menü -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- Navigációs linkek a megfelelő útvonalakhoz -->
            <li class="nav-item">
              <router-link class="nav-link" to="/">Főoldal</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/kapcsolat">Kapcsolat</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/rolunk">Rólunk</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link active" to="/login">Bejelentkezés</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
// A Vue komponens nem igényel további JavaScript logikát
</script>

<style scoped>
/* A body és html elemek teljes szélességre és magasságra vannak állítva */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;  /* 100% magasság */
  width: 100%;   /* 100% szélesség */
}

/* Az alap navbar stílusok a Bootstrapra építve */
.navbar {
  position: fixed; /* Fixált a képernyő tetején */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: white;
  padding: 10px 0;
  text-align: center;
  font-family: 'Franklin Gothic Medium';
  height: 50px;
  transition: transform 0.3s ease-in-out; /* Zökkenőmentes animáció */
}

.navbar.hidden {
  transform: translateY(-100%); /* Eltüntetjük a navbar-t */
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
