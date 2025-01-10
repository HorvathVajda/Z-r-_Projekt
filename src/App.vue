<template>
  <div id="app">
    <NavBar /> <!-- A navigációs sáv -->
    <main id="content">
      <router-view></router-view> <!-- A dinamikusan betöltődő komponens -->
    </main>
    <LabLec /> <!-- A lábléc -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'; // NavBar komponens importálása
import LabLec from './components/LabLec.vue'; // LabLec komponens importálása

export default {
  name: 'App',
  components: {
    NavBar, // NavBar komponens regisztrálása
    LabLec, // LabLec komponens regisztrálása
  },
  methods: {
    // Bejelentkezési session visszaállítása
    restoreSession() {
      const authData = localStorage.getItem("authData");

      if (authData) {
        const { token, email, expirationTime } = JSON.parse(authData);

        // Ellenőrizzük, hogy a token még érvényes-e
        if (Date.now() < expirationTime) {
          this.$store.isLoggedIn = true;
          this.$store.userEmail = email;
        } else {
          // Ha lejárt a token, töröljük a localStorage-ból
          localStorage.removeItem("authData");
          this.$store.isLoggedIn = false;
        }
      }
    },
  },
  created() {
    // A session visszaállítása az alkalmazás betöltésekor
    this.restoreSession();
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#content {
  flex: 1;
  margin-top: 60px; /* Navbar helyének biztosítása */
}

@media (max-width: 768px) {
  #content {
    margin-top: 80px; /* Mobil nézetnél egy kicsit nagyobb margó */
  }
}
</style>
