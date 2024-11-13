<template>
  <div id="app">
    <NavBar />
    <!-- Itt jelenik meg a router által betöltött komponens -->
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  },
}
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
  min-height: 100vh;
  width: 100%;  /* Teljes szélesség */
}
.container-fluid {
  flex-grow: 1; /* A container-kitöltés biztosítása */
}

.navbar {
  width: 100%;
  background-color: #333;
  padding: 1rem;
  padding: 1rem;
  color:  black;
}

</style>
