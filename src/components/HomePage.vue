<template>
  <div class="hero-container">
    <div class="hero-content">
      <div class="hero-text">
        <h1>Foglaljon most időpontot</h1>
        <p>Fedezze fel szolgáltatásainkat és foglaljon időpontot néhány kattintással. Professzionális partnereink várják Önt!</p>
        <div class="action-buttons">
          <button @click="goToBooking" class="primary-btn">Foglaljon most</button>
          <button v-if="!isLoggedIn" @click="goToRegister" class="secondary-btn">Regisztráció</button>
        </div>
      </div>
    </div>

    <div class="search-section">
      <div class="search-wrapper">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Keresés kategóriák között..."
            @input="filterCategories"
            class="search-input"
          />
        </div>
        <ul v-if="filteredCategories.length" class="suggestions-list">
          <li v-for="(category, index) in filteredCategories" :key="index" @click="selectCategory(category)">
            {{ category }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </li>
        </ul>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { store } from "../store";

export default {
  setup() {
    const isLoggedIn = computed(() => store.isLoggedIn);
    const businesses = ref([]);
    const router = useRouter();
    const categories = ref([]);
    const searchQuery = ref("");
    const filteredCategories = ref([]);

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/foglalasok/business-categories");
        const data = await response.json();
        categories.value = data.map(item => item.category);
      } catch (error) {
        console.error("Hiba a kategóriák lekérésekor:", error);
      }
    };

    const fetchServicesByCategory = async () => {
      console.log("Keresett kategória a frontendről:", searchQuery.value);

      try {
        const response = await axios.get(`/api/foglalasok/vallalkozasok`, {
          params: {
            category: searchQuery.value
          }
        });
        businesses.value = response.data.map(business => ({
          vallalkozas_neve: business.vallalkozas_neve,
          category: business.category,
          services: business.services
        }));
      } catch (error) {
        console.error("Hiba történt a szolgáltatások lekérésekor:", error);
      }
    };

    const filterCategories = () => {
      if (!searchQuery.value) {
        filteredCategories.value = [];
        return;
      }

      filteredCategories.value = categories.value.filter(category =>
        category.toLowerCase().startsWith(searchQuery.value.toLowerCase())
      );
    };

    const selectCategory = (category) => {
      searchQuery.value = category;
      filteredCategories.value = [];
      fetchServicesByCategory();
    };

    const goToCategoryPage = () => {
      const selectedBusiness = businesses.value.find(b => {
        return b.category && searchQuery.value && b.category.toLowerCase() === searchQuery.value.toLowerCase();
      });

      if (selectedBusiness) {
        router.push({
          name: 'Foglalas',
          query: { category: searchQuery.value }
        });
      } else {
        console.error('Nincs ilyen kategória.');
      }
    };

    const goToRegister = () => {
      router.push("/registerChoose");
    };

    const goToBooking = () => {
      if (store.isLoggedIn) {
        router.push("/foglalas");
      } else {
        router.push("/login");
      }
    };

    onMounted(fetchCategories);

    return {
      isLoggedIn,
      goToRegister,
      goToBooking,
      businesses,
      searchQuery,
      filteredCategories,
      filterCategories,
      selectCategory,
      goToCategoryPage
    };
  },
};
</script>

<style scoped>
/* Base styles */
:root {
  --primary-color: #6B00D0;
  --primary-hover: #5A00B0;
  --secondary-color: #FFFFFF;
  --text-color: #333333;
  --light-text: #666666;
  --border-radius: 15px;
  --box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

.hero-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #e3d1ff 50%, #c7aaff 100%);
  padding-bottom: 80px;
}

.hero-content {
  padding: 100px 5% 60px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
}

.hero-text {
  max-width: 700px;
  text-align: center;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 24px;
  line-height: 1.2;
}

.hero-text p {
  font-size: 1.25rem;
  color: var(--light-text);
  margin-bottom: 40px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  background-color: #333333;
  color: white;
  padding: 14px 32px;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.primary-btn:hover {
  background-color: #1B1212	;
}

.secondary-btn {
  background-color: transparent;
  color: var(--primary-color);
  padding: 14px 32px;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  border: 2px solid var(--primary-color);
  cursor: pointer;
  transition: var(--transition);
}

.secondary-btn:hover {
  background-color: rgba(107, 0, 208, 0.05);
}

.search-section {
  display: flex;
  justify-content: center;
  padding: 0 5%;
  margin-top: 40px;
}

.search-wrapper {
  max-width: 800px;
  width: 100%;
  position: relative;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  box-shadow: var(--box-shadow);
  padding: 8px;
  border-radius:15px;
  transition: var(--transition);
}

.search-box:focus-within {
  box-shadow: 0 8px 24px rgba(107, 0, 208, 0.2);
}

.search-input {
  flex: 1;
  padding: 16px 24px;
  font-size: 1.1rem;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-color);
}

.search-input::placeholder {
  color: #AAA;
}

.search-btn {
  background: var(--primary-color);
  border: none;
  border-radius: calc(var(--border-radius) - 4px);
  padding: 12px 20px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: var(--primary-hover);
}

.search-btn svg {
  color: white;
  width: 20px;
  height: 20px;
}

.suggestions-list {
  position: absolute;
  width: 100%;
  background: white;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
}

.suggestions-list li {
  padding: 16px 24px;
  font-size: 1rem;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
  border-top: 1px solid #F0F0F0;
}

.suggestions-list li:hover {
  background: rgba(107, 0, 208, 0.05);
  color: var(--primary-color);
}

.suggestions-list li svg {
  opacity: 0;
  transition: var(--transition);
}

.suggestions-list li:hover svg {
  opacity: 1;
}

/* Responsive styles */
@media screen and (max-width: 992px) {
  .hero-text h1 {
    font-size: 2.8rem;
  }

  .hero-text p {
    font-size: 1.1rem;
  }
}

@media screen and (max-width: 768px) {
  .hero-content {
    padding: 80px 5% 40px;
  }

  .hero-text h1 {
    font-size: 2.4rem;
  }

  .hero-text p {
    font-size: 1rem;
    margin-bottom: 30px;
  }

  .primary-btn, .secondary-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }

  .search-input {
    padding: 14px 20px;
    font-size: 1rem;
  }
}

@media screen and (max-width: 576px) {
  .hero-content {
    padding: 60px 5% 30px;
  }

  .hero-text h1 {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .primary-btn, .secondary-btn {
    width: 100%;
  }

  .search-box {
    flex-direction: column;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  .search-input {
    width: 100%;
    margin-bottom: 12px;
    box-shadow: var(--box-shadow);
    background-color: white;
    border-radius: 15px;
  }

  .search-btn {
    width: 100%;
    padding: 14px;
  }

  .suggestions-list {
    position: relative;
  }
}
</style>