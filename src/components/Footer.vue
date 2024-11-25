<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; 2024 BookMyTime. Minden jog fenntartva.</p>
      <nav class="footer-nav">
        <a href="#about" class="footer-link">Rólunk</a>
        <a href="#contact" class="footer-link">Kapcsolat</a>
        <a href="#privacy" class="footer-link">Adatvédelem</a>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  background: white;
  color: black;
  padding: 20px 0;
  text-align: center;
  border-top: 3px solid black;

}

.footer-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  background: white;
  color: black;
  padding: 20px 0;
  text-align: center;
  border-top: 3px solid black;
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
  background: transparent;
}
</style>
