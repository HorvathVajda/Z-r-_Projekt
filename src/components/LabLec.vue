<template>
  <footer class="footer">
    <div class="footer-container">

      <router-link class="nav-link" to="/Kapcsolat">Kapcsolatfelvétel</router-link>
      <router-link class="nav-link" to="/Rolunk">Rólunk</router-link>
      <router-link class="nav-link" to="/Adatvedelem">Adatvédelem</router-link>
    </div>
    <p>&copy; 2024 BookMyTime. Minden jog fenntartva.</p>
  </footer>
</template>

<script>
export default {
  name: "LabLec",
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.footer {
  width: 100%; /* Teljes szélesség */
  background: white;
  color: black;
  padding: 20px 0px;
  text-align: center;
  position: relative;
  bottom: 0;
}

.footer-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  text-align: center;
  flex-direction: row;
}

.footer p {
  margin: 0;
  padding-right: 10px;
}

.navbar-nav {
  display: flex;
  gap: 20px;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-item {
  list-style-type: none;
}

.nav-link {
  color: black;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
  padding: 5px 10px;
  margin: 0 10px;
}
.nav-link:hover {
  color: black;
  background: transparent;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
  }

  .nav-link {
    margin: 5px 0;
  }
}
</style>
