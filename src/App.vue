<template>
  <div id="app">
    <NavBar />
    <main id="content">
      <router-view />
    </main>
    <LabLec />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import LabLec from './components/LabLec.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    LabLec
  }
}
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
  margin-top: 60px;
}

@media (max-width: 768px) {
  #content {
    margin-top: 80px;
  }
}
</style>
