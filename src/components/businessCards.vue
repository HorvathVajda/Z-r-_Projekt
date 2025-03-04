<template>
  <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div
        v-for="(chunk, index) in displayedChunks"
        :key="index"
        class="carousel-item"
        :class="{ active: index === currentIndex, 'slide-animation': index === currentIndex }">

        <div class="container">
          <div class="row">
            <div
              v-for="vallalkozas in chunk"
              :key="vallalkozas.id"
              class="col-md-4"
              @mouseenter="stopSlideShow"
              @mouseleave="startSlideShow">
              <div class="card">
                <div class="card-body text-center">
                  <h5 class="card-title">{{ vallalkozas.vallalkozas_neve }}</h5>
                  <p class="card-text"><strong>Helyszín:</strong> {{ vallalkozas.helyszin }}</p>
                  <p class="card-text"><strong>Nyitva tartás:</strong> {{ vallalkozas.nyitva_tartas }}</p>
                  <button @click="handleButtonClick(vallalkozas)" class="btn mt-3">
                    Szabad időpontok
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Lapozó gombok -->
    <button class="carousel-control-prev" type="button" @click="prevSlide">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    </button>
    <button class="carousel-control-next" type="button" @click="nextSlide">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router'; // Import useRouter from Vue

export default {
  data() {
    return {
      vallalkozasok: [],
      currentIndex: 0,
      slideDelay: 8000,
      slideTimer: null,
      hovering: false,
    };
  },
  computed: {
    displayedChunks() {
      if (!this.vallalkozasok.length) return [];
      let data = [...this.vallalkozasok];
      while (data.length < 3) {
        data = [...data, ...this.vallalkozasok];
      }
      const chunkSize = 3;
      let chunks = [];
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push([data[i % data.length], data[(i + 1) % data.length], data[(i + 2) % data.length]]);
      }
      return chunks;
    }
  },
  mounted() {
    axios
      .get("/api/foglalasok/vallalkozasok")
      .then((response) => {
        console.log("✅ Vállalkozások betöltve:", response.data);
        this.vallalkozasok = response.data;
        this.startSlideShow();
      })
      .catch((error) => {
        console.error("❌ Hiba a vállalkozások betöltésekor:", error);
      });
  },
  methods: {
    nextSlide() {
      if (!this.hovering) {
        this.currentIndex = (this.currentIndex + 1) % this.displayedChunks.length;
      }
    },
    prevSlide() {
      if (!this.hovering) {
        this.currentIndex = (this.currentIndex - 1 + this.displayedChunks.length) % this.displayedChunks.length;
      }
    },
    startSlideShow() {
      if (!this.hovering) {
        this.slideTimer = setInterval(this.nextSlide, this.slideDelay);
      }
    },
    stopSlideShow() {
      if (this.slideTimer) {
        clearInterval(this.slideTimer);
        this.slideTimer = null;
      }
    },
    handleButtonClick(vallalkozas) {
      // A 'vallalkozas' objektum egy elemében lévő 'category' értéke
      const category = vallalkozas.category;

      // A vállalkozás ID-ját és a kategóriát is átadjuk
      this.router.push({
        name: 'Foglalas',
        params: { vallalkozas_id: vallalkozas.id, category }
      });
    }

  },
  beforeDestroy() {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }
  },
  setup() {
    const router = useRouter(); // useRouter only in setup()
    return { router };
  }
};
</script>

<style scoped>
.carousel-item {
  padding: 20px;
  transition: transform 1s ease, opacity 1s ease;
  opacity: 0; /* Kezdetben rejtett */
}

.carousel-item.active {
  opacity: 1; /* Az aktív elem látható */
}

.carousel-item.slide-animation {
  transform: translateX(100%); /* Jobbra csúszó animáció */
}

.carousel-item.active.slide-animation {
  transform: translateX(0); /* Az aktív elem középre csúszik */
}

.card {
  width: 100%;
  margin: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: scale(1.05);
}

.carousel-control-prev,
.carousel-control-next {
  background: transparent;
  width: 5%;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: black; /* A nyíl színét feketévé változtatjuk */
  border-radius: 50%; /* Kör alakú legyen */
}

.btn {
  width: 100%;
  font-size: 1rem;
  background-color: #6B00D0;
  border: none;
  color: white;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  outline: none;  /* Eltávolítja a fókusz körvonalat */
}

/* Hover állapot */
.btn:hover {
  background-color: #6B00D0;
  box-shadow: none;  /* Eltávolítja a hover árnyékot */
  color: white;
}

/* Focus állapot */
.btn:focus {
  background-color: #6B00D0;
  box-shadow: none;  /* Eltávolítja a fókusz árnyékot */
  outline: none;  /* Eltávolítja a fókusz körvonalat */
  color: white;
}

/* Active állapot */
.btn:active {
  background-color: #6B00D0;
  box-shadow: none;  /* Eltávolítja az aktív állapot árnyékot */
  outline: none;  /* Eltávolítja az aktív körvonalat */
  color: white;
}

</style>
