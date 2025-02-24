<template>
  <section class="business-section">
    <h2>Válassz egy vállalkozást</h2>

    <!-- Kategóriák választhatósága -->
    <div class="category-selector">
      <label for="category-select">Kategória:</label>
      <select v-model="selectedCategory" @change="filterBusinesses">
        <option value="">Minden kategória</option> <!-- Manuálisan hozzáadott "Minden kategória" -->
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Vállalkozások listája -->
    <div class="business-cards">
      <div
        class="business-card"
        v-for="business in filteredBusinesses"
        :key="business.id"
      >
        <img src="/as.jpg" alt="Business Image" class="business-image" />
        <h3>{{ business.vallalkozas_neve }}</h3>
        <p>{{ business.helyszin }}</p>
        <p>{{ business.nyitva_tartas }}</p>
        <button @click="selectBusiness(business)">Választás</button>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const businesses = ref([]); // Minden vállalkozás tárolása
const categories = ref([]); // Kategóriák tárolása
const selectedCategory = ref(''); // A kiválasztott kategória
const filteredBusinesses = ref([]); // A szűrt vállalkozások tárolása

const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/businesses/business-categories');
    categories.value = [...new Set(response.data.map((item) => item.category))];
    console.log('Kategóriák:', categories.value);
  } catch (error) {
    console.error('Hiba a kategóriák lekérésekor:', error);
  }
};

const fetchBusinesses = async () => {
  try {
    const response = await axios.get('/api/businesses/vallalkozasok');
    businesses.value = response.data;
    console.log('Vállalkozások:', businesses.value);
    filterBusinesses();
  } catch (error) {
    console.error('Hiba a vállalkozások betöltésekor:', error);
  }
};

// A szűrés a kiválasztott kategória alapján
const filterBusinesses = () => {
  console.log('Szűrés kategória szerint:', selectedCategory.value);

  // Ha nincs kategória kiválasztva, minden vállalkozást megjelenítünk
  if (selectedCategory.value && selectedCategory.value !== '') {
    filteredBusinesses.value = businesses.value.filter(
      (business) => business.category && business.category.toLowerCase() === selectedCategory.value.toLowerCase()
    );

  } else {
    filteredBusinesses.value = businesses.value;
  }

  console.log('Szűrt vállalkozások:', Array.from(filteredBusinesses.value));

};
const selectBusiness = (business) => {
  alert(`Választottad a következő vállalkozást: ${business.vallalkozas_neve}`);
};

onMounted(() => {
  fetchCategories();
  fetchBusinesses();
});
</script>

<style scoped>
.business-section {
  padding: 40px;
  background-color: #f9f9f9;
  text-align: center;
}

.category-selector {
  margin-bottom: 20px;
}

select {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.business-cards {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.business-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 250px; /* A kártyák szélessége megnövelve */
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.business-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.business-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

button {
  margin-top: 10px;
  background-color: #6b00d0;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #5a00b0;
}
</style>
