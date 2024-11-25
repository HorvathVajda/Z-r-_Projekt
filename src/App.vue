<template>
  <div id="app">
    <NavBar />
    <!-- Itt jelenik meg a router által betöltött komponens -->
    <router-view></router-view>
    <LabLec />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import LabLec from './components/LabLec.vue';
import axios from 'axios'; // Axios importálása

export default {
  name: 'App',
  components: {
    NavBar,
    LabLec,
  },
  data() {
    return {
      apiMessage: '', // Az API-tól érkező üzenet tárolására
    };
  },
  mounted() {
    // API hívás az oldal betöltésekor
    axios.get('/api')
      .then(response => {
        this.apiMessage = response.data.message; // Az API válasz beállítása
      })
      .catch(error => {
        console.error('Hiba történt az API hívás során:', error);
      });
  },
};
</script>

<style>
/* Alapstílusok az App.vue-hoz */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;   /* 100% magasság */
  width: 100%;    /* 100% szélesség */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;  /* Teljes szélesség */
}
</style>
