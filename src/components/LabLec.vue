<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; 2024 BookMyTime. Minden jog fenntartva.</p>
      <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/Kapcsolat" @click="toggleMenu"> Kapcsolat</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/Rolunk" @click="toggleMenu">Rólunk</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/Adatvedelem" @click="toggleMenu">Adatvédelem</router-link>
            </li>
          </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: "LabLec",
};
</script>

<style scoped>
.footer {
  background: white;
  color: black;
  padding: 20px 0;
  text-align: center;
  border-top: 3px solid black;
  bottom: 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.footer-nav {
  margin-top: 10px;
}

.footer-link {
  color: black;
  text-decoration: none;
  margin: 0 10px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: black;
}
</style>
