<template>
  <div class="harmadik-container">
    <img src="/s2.png" alt="Vállalkozóknak" class="harmadik-image" />
    <div class="harmadik-info-box">
      <h2>Foglaljon most időpontot</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla alias, ad quae nisi recusandae officiis sapiente fuga, similique incidunt fugiat ducimus dolores iure nesciunt quam facilis. Quam tempora temporibus possimus!</p>
      <div class="gombok">
        <a @click="goToBooking" class="home-button">Foglaljon most</a>
        <a v-if="!isLoggedIn" @click="goToRegister" class="home-button-register">Regisztráció</a>
      </div>
    </div>
  </div>

  <router-view></router-view>

  <div class="search-container">
    <div class="search-input-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Keresés kategóriák között..."
        @input="filterCategories"
        class="search-input"
      />
      <img
        src="/kereses_logo.png"
        alt="Search"
        class="search-icon"
        @click="fetchServicesByCategory"
      />
    </div>
    <ul v-if="filteredCategories.length" class="suggestions">
      <li v-for="(category, index) in filteredCategories" :key="index" @click="selectCategory(category)">
        {{ category }}
      </li>
    </ul>
  </div>

  <div v-if="businesses.length" class="business-list">
    <h3>Vállalkozások és Szolgáltatásaik</h3>
    <div v-for="business in businesses" :key="business.id" class="business-item">
      <h4>{{ business.vallalkozas_neve }}</h4>
      <ul>
        <li v-for="service in business.services" :key="service.szolgaltatas_id">
          {{ service.szolgaltatas_neve }} - {{ service.ar }} Ft
        </li>
      </ul>
    </div>
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
        categories.value = data.map(item => item.category); // Csak a kategória mezőket vesszük ki
      } catch (error) {
        console.error("Hiba a kategóriák lekérésekor:", error);
      }
    };

    const fetchServicesByCategory = async () => {
      try {
        const response = await axios.get(`/api/foglalasok/szolgaltatasok/${searchQuery.value}`);
        businesses.value = response.data.map(business => ({
          vallalkozas_neve: business.vallalkozas_neve,
          services: business.services // Szolgáltatások adatainak kezelése
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
      filteredCategories.value = []; // Eltünteti a javaslatokat
      fetchServicesByCategory(); // Szolgáltatások lekérése
    };

    const goToLogin = () => {
      router.push("/login");
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
      goToLogin, 
      goToRegister, 
      goToBooking, 
      businesses, 
      searchQuery,
      filteredCategories,
      filterCategories,
      selectCategory,
      fetchServicesByCategory 
    };
  },
};
</script>

<style scoped>
/* Alap stílusok */
.gombok {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
}


.home-button, .home-button-register {
  font-size: 20px;
  font-weight: bold;
  padding: 0.55rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 25px;
  text-decoration: none;
}

.home-button {
  background-color: #6B00D0;
  color: white;
}

.home-button-register {
  background: transparent;
  color: black;
  text-decoration: none;
}


/* Konténerek és képek */
.harmadik-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
  position: relative;
}

.harmadik-container {
  flex: 1;
}

.harmadik-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.harmadik-info-box{
  position: absolute;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}


.info-box {
  top: 45%;
  right: 20%;
  transform: translate(-50%, -50%);
  color: white;
  max-width: 500px;
}

.harmadik-info-box h2 {
  font-size: 40px;
}

.harmadik-info-box p {
  font-size: 20px;
}

/* Harmadik konténer speciális stílusai */
.harmadik-info-box {
  top: 50%;
  left: 20%;
  transform: translate(-50%, -50%);
  color: #6B00D0;
  text-align: left;
  max-width: 550px;
  margin-left: 60px;
}

.harmadik-info-box h2 {
  font-size: 70px;
  margin-bottom: 35px;
}

.harmadik-info-box p {
  font-size: 22px;
  color: black;
  text-align: center;
}

/* Keresőmező középre igazítása */
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 50px;
}

/* Keresőmező stílus */
.search-input-container {
  display: flex;
  align-items: center;
}

.search-input {
  width: 400px;
  padding: 10px;
  font-size: 18px;
  border: 2px solid #6B00D0;
  border-radius: 25px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #9A32CD;
  box-shadow: 0 0 10px rgba(155, 50, 205, 0.5);
}

.search-icon {
  width: 30px;
  height: 30px;
  margin-left: 10px;
  cursor: pointer;
}

.suggestions {
  width: 50%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 10px;
  list-style: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.suggestions li {
  padding: 12px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s ease;
}

.suggestions li:hover {
  background-color: #6B00D0;
  color: white;
  border-radius: 10px;
}
/* Reszponzív beállítások */
@media screen and (max-width: 768px) {
  /* Képernyő szélessége 768px alatt */
.harmadik-container {
    flex-direction: column;
    padding: 10px;
  }

.harmadik-info-box {
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    width: 100%;
    max-width: none;
    margin: 0;
  }

 .harmadik-info-box h2 {
    font-size: 28px;
  }

.harmadik-info-box p {
    font-size: 16px;
  }

  .gombok {
    flex-direction: column;
    gap: 10px;
  }

  .home-button, .home-button-register {
    font-size: 18px;
    padding: 0.45rem 1rem;
  }

  .harmadik-info-box {
    margin-left: 0;
    text-align: center;
  }

  .harmadik-info-box h2 {
    font-size: 50px;
  }

  .harmadik-info-box p {
    font-size: 18px;
  }

  .search-input {
    width: 80%;
    font-size: 16px;
  }

  .suggestions {
    width: 80%;
  }

  .suggestions li {
    font-size: 16px;
    padding: 10px;
  }
}

@media screen and (max-width: 480px) {
  /* Képernyő szélessége 480px alatt (mobil) */
.harmadik-info-box h2 {
    font-size: 24px;
  }

.harmadik-info-box p {
    font-size: 14px;
  }

  .home-button, .home-button-register {
    font-size: 16px;
    padding: 0.35rem 0.8rem;
  }

  .search-input {
    width: 90%;
    font-size: 14px;
  }

  .suggestions {
    width: 90%;
  }

  .suggestions li {
    font-size: 14px;
    padding: 8px;
  }
}

</style>
