<template>
  <div id="app">
    <NavBar /> <!-- A navigációs sáv -->
    <main id="content">
      <router-view></router-view> <!-- A dinamikusan betöltődő komponens -->
    </main>
    <!-- Csak akkor jelenik meg a lábléc, ha nem a kizárt oldalon vagyunk -->
    <LabLec v-if="!isExcludedPage" />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'; // NavBar komponens importálása
import LabLec from './components/LabLec.vue'; // LabLec komponens importálása
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    NavBar,
    LabLec,
  },
  setup() {
    const route = useRoute();
    const excludedPages = ['/registerChoose', '/login', '/register', '/vallalkozoRegister', '/vallalkozoHome', '/vallalkozoHome/profil', '/Foglalas']; // Ide add hozzá a kizárt oldalakat
    const isExcludedPage = computed(() => excludedPages.includes(route.path));

    return {
      isExcludedPage,
    };
  },
  methods: {
  restoreSession() {
    const authData = localStorage.getItem("authData");

    if (authData) {
      // Olvasd ki az összes mezőt: token, email, expirationTime, id, tipus
      const { token, email, expirationTime, id, tipus } = JSON.parse(authData);

      if (Date.now() < expirationTime) {
        // Frissítjük az authData-t és a store-t az összes mezővel
        this.$store.updateAuthData({ token, email, expirationTime, id, tipus });
        this.$store.userEmail = email;  // Példaként, ha szükséges más adat is
      } else {
        localStorage.removeItem("authData");
        this.$store.clearAuthData();
      }
    }
  },
},
  created() {
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
}

@media (max-width: 768px) {
  #content {
    margin-top: 80px;
  }
}
</style>
