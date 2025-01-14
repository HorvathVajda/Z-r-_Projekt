<template>
  <footer class="footer">
    <div class="footer-container">
      <a class="nav-link" href="/kapcsolat">Kapcsolatfelvétel</a>
      <a class="nav-link" href="/rolunk">Rólunk</a>
      <a class="nav-link" href="/adatvedelem">Adatvédelem</a>

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
.footer {
  width: 100%;
  height: 60px;
  background-color: #F4F4F4 !important;
  color: black;
  padding: 20px 0;
  text-align: center;
  position: relative;
  bottom: 0;
  margin-bottom: 25px;
}

.footer-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
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
</style>
