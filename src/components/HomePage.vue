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
      <div class="info-box">
        <h2>Foglalj időpontot online</h2>
        <p>keresd meg a legjobb helyeket a környéken, és kezeld a vállalkozásod foglalásait egy helyen</p>
      </div>
    </div>

    <!-- Vállalkozóknak szóló üzenet -->
    <div class="business-container">
      <img src="/hatter2.jpg" alt="Vállalkozóknak" class="business-image" />
      <div class="business-info-box">
        <h2>Vállalkozóknak</h2>
        <p>Csatlakozz a rendszerhez és kezeld foglalásaidat egyszerűen! Növeld ügyfélköröd és könnyítsd meg a munkád!</p>
      </div>
    </div>

    <div class="results">
      <ul>
        <li v-for="business in filteredBusinesses" :key="business.id">{{ business.name }}</li>
      </ul>
    </div>
  </div>

  <LabelLec />
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      searchQuery: "",
      businesses: [],
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
    this.businesses = [
      { id: 1, name: "Fodrász", type: "Szolgáltatás" },
      { id: 2, name: "Autószerelő", type: "Szolgáltatás" },
    ];
  },
};
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* A teljes képernyőt kitölti */
}

.image-container {
  flex: 0 1 50%; /* Az első szakasz fele a képernyőnek */
  position: relative;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-bar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
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
  background-color: rgba(255, 255, 255, 0.7);
}

.info-box {
  position: absolute;
  top: 45%;
  right: 20%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
}

.info-box h2 {
  font-size: 40px;
  margin-bottom: 10px;
}

.info-box p {
  font-size: 18px;
}

/* Vállalkozóknak szóló szakasz */
.business-container {
  flex: 0 1 50%; /* A második szakasz fele a képernyőnek */
  position: relative;
}

.business-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.business-info-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
  max-width: 350px;
}

.business-info-box h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.business-info-box p {
  font-size: 18px;
}

.results {
  margin-top: 20px;
  padding: 20px;
}

.results ul {
  list-style-type: none;
  padding: 0;
}

.results li {
  margin: 10px 0;
}
</style>
