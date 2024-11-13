<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
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
  width: 100%;   /* Ezt adjuk hozzá */
  padding: 0.5rem 1rem;
  margin-bottom: 10px;
}

.container-fluid {
  width: 100%;   /* Ezt is biztosítjuk */
  padding: 0;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  color: black;
  text-decoration: none;
}

.logo:hover {
  color: #ff007f;
}

.nav-link {
  color: white;
  color: goldenrod;
  background: transparent;
}

.nav-link {
  color: black;
  text-decoration: none;
}

.nav-link:hover {
  color: #dcdcdc;
}

.nav-link.active {
  background-color: #ff007f;
  color: gray;
  background: transparent;
}

.nav-link.active:hover{
  color: grey;
}
.nav-link.active {
  background-color: goldenrod;
  color: white;
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
}
</style>

