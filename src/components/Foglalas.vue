<template>
  <div class="container">
    <h2>Szolgáltatások</h2>
    <div class="cards">
      <div
        v-for="szolgaltatas in szolgaltatasok"
        :key="szolgaltatas.szolgaltatas_id"
        class="card"
      >
        <h3>{{ szolgaltatas.szolgaltatas_neve }}</h3>
        <p><strong>Vállalkozás:</strong> {{ szolgaltatas.vallalkozas_neve }}</p>
        <p><strong>Időtartam:</strong> {{ szolgaltatas.idotartam }} perc</p>
        <p><strong>Ár:</strong> {{ szolgaltatas.ar }} Ft</p>
        <button @click="fetchSzabadIdopontok(szolgaltatas.szolgaltatas_id)">
          Szabad időpontok
        </button>
      </div>
    </div>

    <!-- Modal for free time slots -->
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="modalVisible = false">&times;</span>
        <h3>Szabad időpontok</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";


export default {
  data() {
    return {
      szolgaltatasok: [],
      modalVisible: false,
      szabadIdopontok: [],
      selectedDate: new Date().toISOString().substr(0, 10), // Kezdeti kiválasztott dátum
      events: [], // A naptár eseményei (szabad időpontok
    };
  },
  components: {
    
  },
  mounted() {
    this.fetchSzolgaltatasok();
  },
  methods: {
    async fetchSzolgaltatasok() {
      try {
        const response = await axios.get("/api/foglalas/szolgaltatasok");
        this.szolgaltatasok = response.data;
      } catch (error) {
        console.error("Hiba a szolgáltatások lekérdezésekor:", error);
      }
    },
    async fetchSzabadIdopontok(szolgaltatasId) {
      try {
        // API hívás, hogy lekérjük a szabad időpontokat a választott szolgáltatáshoz
        const response = await axios.get(`/api/foglalas/szabad-idopontok/${szolgaltatasId}`);
        this.szabadIdopontok = response.data;

        // A válaszban lévő időpontokat hozzuk létre eseményekként a naptárhoz
        this.events = this.szabadIdopontok.map((ido) => ({
          name: "Szabad időpont",
          start: ido.szabad_ido, // Az időpontokat a megfelelő formátumban kell beállítani
          end: ido.szabad_ido,
        }));

        // Modal megjelenítése
        this.modalVisible = true;
      } catch (error) {
        console.error("Hiba a szabad időpontok lekérésekor:", error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  background: #222;
  color: #fff;
  padding: 15px;
  border-radius: 10px;
  width: 280px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.card h3 {
  margin-bottom: 10px;
}

.card p {
  margin: 5px 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
}
</style>
