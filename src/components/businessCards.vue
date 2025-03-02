<template>
  <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <!-- Iterálunk a vállalkozásokon, és minden három elemet egy szlájdban jelenítünk meg -->
      <div
        v-for="(vallalkozasokChunk, index) in paginate(vallalkozasok, 3)"
        :key="index"
        :class="['carousel-item', { active: index === currentIndex }]">

        <div class="row">
          <!-- A három vállalkozás egy szlájdon -->
          <div v-for="vallalkozas in vallalkozasokChunk" :key="vallalkozas.id" class="col-4">
            <div class="carousel-content">
              <h3>{{ vallalkozas.vallalkozas_neve }}</h3>
              <p><strong>Helyszín:</strong> {{ vallalkozas.helyszin }}</p>
              <p><strong>Nyitva tartás:</strong> {{ vallalkozas.nyitva_tartas }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Karusszel navigációs gombok -->
    <button class="carousel-control-prev" type="button" @click="previousSlide">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    </button>
    <button class="carousel-control-next" type="button" @click="nextSlide">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      vallalkozasok: [],
      currentIndex: 0, // A jelenlegi aktív szlájdszám
    };
  },
  mounted() {
    axios.get('/api/foglalasok/vallalkozasok')
      .then(response => {
        this.vallalkozasok = response.data;
      })
      .catch(error => {
        console.error('Hiba a vállalkozások betöltésekor:', error);
      });
  },
  methods: {
    // A vállalkozásokat három elemre oldjuk, hogy egy szlájdon három vállalkozás jelenjen meg
    paginate(arr, size) {
      let result = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    },
    nextSlide() {
      if (this.currentIndex < this.paginate(this.vallalkozasok, 3).length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    },
    previousSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.paginate(this.vallalkozasok, 3).length - 1;
      }
    }
  }
};
</script>

<style scoped>
.carousel-content {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 10px;
  margin-bottom: 20px;
  max-width: 160px;
  max-height: 160px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.carousel-inner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.d-flex {
  display: flex;
}

.col-4 {
  display: flex;
  justify-content: center;
  padding: 0 5px;
}

.carousel-control-prev,
.carousel-control-next {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
</style>
