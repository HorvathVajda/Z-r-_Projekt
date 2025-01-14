<template>
  <div class="search-container">
    <div class="image-container">
      <img src="/hatter.jpg" alt="Kép" class="background-image" />
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Keresés vállalkozás típusra..."
          @input="searchBusinesses"
        />
      </div>
    </div>

    <div class="results">
      <ul>
        <li v-for="business in filteredBusinesses" :key="business.id">{{ business.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      businesses: [], // Itt tárolod az adatbázisból lekért vállalkozásokat
      filteredBusinesses: [],
    };
  },
  methods: {
    searchBusinesses() {
      this.filteredBusinesses = this.businesses.filter(business =>
        business.type.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  mounted() {
    // Adatok betöltése az adatbázisból vagy API hívás
    this.businesses = [
      { id: 1, name: "Fodrász", type: "Szolgáltatás" },
      { id: 2, name: "Autószerelő", type: "Szolgáltatás" },
      // További adatok
    ];
  },
};
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%; /* A háttérkép teljes képernyőt kitölti */
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-bar {
  position: absolute;
  bottom: 20px; /* Kép aljára helyezve, de 20px távolságra */
  left: 50%;
  transform: translateX(-50%);
  width: 60%; /* Kereső szélessége */
  padding: 10px;
  border-radius: 25px;
  display: flex;
  justify-content: center;

}

.search-bar input {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  /*background-color: rgba(255, 255, 255, 0.7); /* Félátlátszó háttér */
}

.results {
  margin-top: 20px;
  padding: 20px;
  /*background-color: #fff; /* Fehér háttér a találatoknak */
}

.results ul {
  list-style-type: none;
  padding: 0;
}

.results li {
  margin: 10px 0;
}
</style>
