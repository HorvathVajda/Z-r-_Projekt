<template>
  <div id="app">
    <NavBar />
    <!-- Itt jelenik meg a router által betöltött komponens -->
    <router-view></router-view>
    <FooTer />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
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
  min-height: 100vh;
  width: 100%;  /* Teljes szélesség */
}

router-view {
  flex: 1; /* A router által betöltött komponens kitölti a fennmaradó helyet */
}
</style>
