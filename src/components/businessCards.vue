<template>
  <section class="business-section">
    <h2>Válassz egy vállalkozást</h2>

    <!-- Kategóriák választhatósága -->
    <div class="category-selector">
      <label for="category-select">Kategória:</label>
      <select v-model="selectedCategory" @change="filterBusinesses">
        <option value="">Minden kategória</option>
        <option value="hairdresser">Hajszalon</option>
        <option value="mechanic">Autószerelő</option>
        <option value="fitness">Fitness terem</option>
      </select>
    </div>

    <!-- Vállalkozások listája -->
    <div class="business-cards">
      <div
        class="business-card"
        v-for="business in filteredBusinesses"
        :key="business.id"
      >
        <img :src="business.image" alt="Business Image" class="business-image" />
        <h3>{{ business.name }}</h3>
        <p>{{ business.description }}</p>
        <button @click="selectBusiness(business)">Választás</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const businesses = ref([
  { id: 1, name: 'Minta Hajszalon', description: 'Professzionális hajápolás', category: 'hairdresser', image: 'path_to_image_1.jpg' },
  { id: 2, name: 'Autószerelő Műhely', description: 'Gyors és megbízható autószerviz', category: 'mechanic', image: 'path_to_image_2.jpg' },
  { id: 3, name: 'Fitness Club', description: 'Legújabb fitnesz gépek és órák', category: 'fitness', image: 'path_to_image_3.jpg' },
  { id: 4, name: 'Hajvágó Szalon', description: 'Stílusos hajvágások minden alkalomra', category: 'hairdresser', image: 'path_to_image_4.jpg' },
]);

const selectedCategory = ref('');
const filteredBusinesses = ref(businesses.value);

const filterBusinesses = () => {
  if (selectedCategory.value) {
    filteredBusinesses.value = businesses.value.filter(
      (business) => business.category === selectedCategory.value
    );
  } else {
    filteredBusinesses.value = businesses.value;
  }
};

const selectBusiness = (business) => {
  // Itt később navigálhatsz vagy egyéb műveletet végezhetsz, pl. a foglalás oldalra
  alert(`Választottad a következőt: ${business.name}`);
};
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
  width: 200px;
  text-align: center;
  transition: transform 0.3s;
}

.business-card:hover {
  transform: translateY(-10px);
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
