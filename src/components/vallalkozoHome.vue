<template>
  <div class="homepage">
    <!-- Fejléc -->
    <header class="header">
      <div class="logo">
        <h1>{{ businessName }}</h1>
      </div>
      <nav class="navbar">
        <ul>
          <li><a href="#about">Rólunk</a></li>
          <li><a href="#services">Szolgáltatások</a></li>
          <li><a href="#contact">Kapcsolat</a></li>
          <li v-if="isLoggedIn">
            <button @click="manageBusiness">Vállalkozásaim</button>
          </li>
          <li v-if="isLoggedIn">
            <button @click="bookOtherBusinesses">Foglalás másoknál</button>
          </li>
          <li v-else>
            <button @click="goToLogin">Bejelentkezés</button>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Üdvözlő szakasz -->
    <section class="intro">
      <h2>Üdvözöljük a {{ businessName }} oldalán!</h2>
      <p>{{ businessDescription }}</p>
    </section>

    <!-- Rólunk szakasz -->
    <section id="about" class="about">
      <h2>Rólunk</h2>
      <p>{{ aboutText }}</p>
    </section>

    <!-- Szolgáltatások szakasz -->
    <section id="services" class="services">
      <h2>Szolgáltatások</h2>
      <ul>
        <li v-for="service in services" :key="service.id">
          <h3>{{ service.name }}</h3>
          <p>{{ service.description }}</p>
        </li>
      </ul>
    </section>

    <!-- Kapcsolat szakasz -->
    <section id="contact" class="contact">
      <h2>Kapcsolat</h2>
      <p>{{ contactText }}</p>
      <a :href="'mailto:' + contactEmail">{{ contactEmail }}</a>
    </section>

    <!-- Lábléc -->
    <footer class="footer">
      <p>&copy; 2024 {{ businessName }}. Minden jog fenntartva.</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      businessName: "Minta Vállalkozás",
      businessDescription: "A legjobb hely a legjobb szolgáltatásokhoz.",
      aboutText: "Cégünk több éves tapasztalattal rendelkezik, és mindig arra törekszünk, hogy ügyfeleink elégedettek legyenek.",
      services: [
        { id: 1, name: "Szolgáltatás 1", description: "Szolgáltatás leírása" },
        { id: 2, name: "Szolgáltatás 2", description: "Szolgáltatás leírása" },
        { id: 3, name: "Szolgáltatás 3", description: "Szolgáltatás leírása" }
      ],
      contactText: "Ha bárminemű kérdése van, kérjük lépjen kapcsolatba velünk.",
      contactEmail: "info@mintavallalkozas.hu",
      isLoggedIn: false, // Ellenőrzi, hogy a felhasználó be van-e jelentkezve
    };
  },
  methods: {
    // A "Vállalkozásaim" gombra kattintáskor
    manageBusiness() {
      // Itt az adatbázisból lekérdezheted a felhasználó vállalkozásait
      this.$router.push({ name: 'manageBusinesses' });
    },

    // A "Foglalás másoknál" gombra kattintáskor
    bookOtherBusinesses() {
      // Ide a foglalási rendszerhez vezető oldalra navigálhatsz
      this.$router.push({ name: 'bookOtherBusinesses' });
    },

    // Bejelentkezéshez navigálás
    goToLogin() {
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
.homepage {
  font-family: Arial, sans-serif;
  color: #333;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar ul {
  list-style: none;
  padding: 0;
}

.navbar ul li {
  display: inline;
  margin: 0 10px;
}

.navbar ul li a, .navbar ul li button {
  color: white;
  text-decoration: none;
  background-color: #16a085;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

.navbar ul li button:hover {
  background-color: #1abc9c;
}

.intro {
  background: #ecf0f1;
  padding: 50px;
  text-align: center;
}

.about, .services, .contact {
  padding: 20px;
  margin: 20px;
}

footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 10px;
}
</style>
