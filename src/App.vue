<template>
  <div id="app">
    <NavBar />
    <!-- Tartalom -->
    <main id="content">
      <router-view />
    </main>
    <LabLec />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import LabLec from './components/LabLec.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    NavBar,
    LabLec,
  }
}
</script>

<style>
/* Reset alapstílusok */
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

/* Fő App beállítás */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Tartalom megfelelő eltolása */
#content {
  flex: 1; /* Tartalom kitölti a fennmaradó helyet */
  margin-top: 60px; /* NavBar tényleges magassága */
}

/* Navigáció magasság kezelése mobil eszközökhöz */
@media (max-width: 768px) {
  #content {
    margin-top: 80px; /* Mobil NavBar magasság */
  }
}
</style>
