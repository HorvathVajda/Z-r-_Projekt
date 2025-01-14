<template>
  <div class="settings-page">
    <div class="sidebar">
      <ul>
        <li><a href="#">Profil szerkesztése</a></li>
        <li><a href="#">Vállalkozások</a></li>
        <li><a href="#">Vélemények</a></li>
        <li><a href="#">Fényképek</a></li>
        <li><a href="#">Névjegy</a></li>
        <li><a href="#">Ajánlatok</a></li>
      </ul>
    </div>

    <div class="main-content">
      <div class="header">
        <h2>Vállalkozás Beállításai</h2>
        <button class="edit-btn">Módosítás</button>
      </div>

      <div class="content">
        <div class="settings-item">
          <h3>Általános</h3>
          <p><strong>Kategória:</strong> Vállalkozó</p>
          <p><strong>Név:</strong> Teszt Kft.</p>
        </div>

        <div class="settings-item">
          <h3>Leírás</h3>
          <p>Ez a szöveg mutatja a vállalkozásról készült leírást.</p>
        </div>

        <div class="settings-item">
          <h3>Elérhetőségek</h3>
          <p><strong>E-mail:</strong> test@example.com</p>
          <p><strong>Weboldal:</strong> www.testkft.hu</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage'
};
</script>

<style scoped>
.settings-page {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: white;
  color: black;
  padding: 20px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar a {
  color: black;
  text-decoration: none;
  font-size: 16px;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-btn {
  background-color: gold;
  color: black;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: goldenrod;
}

.settings-item {
  margin-bottom: 20px;
}

.settings-item h3 {
  color: black;
}

.settings-item p {
  color: black;
}
</style>
