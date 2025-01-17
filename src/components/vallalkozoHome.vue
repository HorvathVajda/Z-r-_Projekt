<template>
  <div class="dashboard-container">
    <!-- Oldalsáv -->
    <aside class="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><a href="#">Beállítások</a></li>
        <li><a href="#">Profil</a></li>
        <li><a href="#">Értesítések</a></li>
        <li><a href="#">Kijelentkezés</a></li>
      </ul>
    </aside>

    <!-- Fő tartalom -->
    <main class="main-content">
      <header>
        <h1>Vállalkozásaim</h1>
      </header>
      <div class="business-grid">
        <!-- Példa kockák -->
        <div class="business-card">Vállalkozás 1</div>
        <!-- Új vállalkozás négyzet -->
        <div class="business-card add-business-card">
          <span>+</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "VallalkozoHome",
};
</script>

<style scoped>
/* Alap konténer */
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

/* Oldalsáv (Dashboard) */
.sidebar {
  width: 250px;
  background-color: #6327A2; /* Sötét lila */
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  margin-top: 80px;
  border-radius: 15px;
  margin-left: 10px;
}

.sidebar h2 {
  margin: 0 0 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.sidebar ul li a:hover {
  color: grey; /* Aranysárga */
}

/* Fő tartalom */
.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #EDEDED; /* Világos szürke */
  margin-top: 70px;
}

.main-content header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-content h1 {
  margin: 0;
  font-size: 24px;
  color: #5A3472;
}

/* Kockák rács (Grid) */
.business-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.business-card {
  background-color: white;
  border: 1px solid #C3B1E1; /* Pasztell lila */
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

}

.business-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Új vállalkozás négyzet */
.add-business-card {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: #5A3472; /* Lila */
  background-color: white; /* Aranysárga */
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.add-business-card:hover {
  background-color: #D3A537; /* Sötétebb aranysárga */
  transform: scale(1.05);
}
</style>
