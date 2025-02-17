<template>
  <div class="dashboard-container">
    <!-- Oldalsáv -->
    <aside class="sidebar">
      <h2 class="sidebar-header">
        <router-link to="/vallalkozoHome" class="header-link">Dashboard</router-link>
      </h2>
      <ul>
        <li>
          <router-link to="/vallalkozoHome/profil">Profil</router-link>
        </li>
        <li>
          <router-link to="/vallalkozoHome/ertesitesek">Foglalj</router-link>
        </li>
      </ul>
    </aside>

    <!-- Fő tartalom -->
    <main class="main-content">
      <!-- Router view csak egyszer -->
      <router-view></router-view>
    </main>
  </div>
</template>


<script>
export default {
  name: "VallalkozoHome"
};
</script>

<style scoped>
/* Az oldalsáv és fő tartalom elrendezése */
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

.sidebar-header {
  margin: 0 0 20px;
  /* Eltávolítjuk az alapértelmezett h2 stílust (például nagy betűméret, vastag betűk) */
  font-size: 16px;
  font-weight: normal;
}

/* A h2-ben lévő link stílusa (ugyanaz, mint a li linkeké) */
.header-link {
  color: white;
  text-decoration: none;
  font-size: 35px;
  display: block;
  transition: color 0.3s;
}

.header-link:hover {
  background: transparent;
}

/* Li linkek eredeti stílusa */
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
  font-size: 18px;
  transition: color 0.3s;

}

.sidebar ul li a:hover {
  background: transparent;

}

/* Fő tartalom */
.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #EDEDED;
  margin-top: 70px;
}
</style>
