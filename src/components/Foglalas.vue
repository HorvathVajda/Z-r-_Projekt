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
        <form>
          <ul>
            <li v-for="ido in szabadIdopontok" :key="ido.ido_id">
              <label>
                <input type="radio" :value="ido.ido_id" v-model="selectedIdo">
                {{ ido.szabad_ido }} - {{ ido.statusz }}
              </label>
            </li>
          </ul>
        </form>
        <button class="foglalas-btn" @click="bookAppointment">Foglalás</button>
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
      selectedIdo: null,
      selectedSzolgaltatasId: null, // Store the selected service ID
    };
  },
  mounted() {
    this.fetchSzolgaltatasok();
  },
  methods: {
    async fetchSzolgaltatasok() {
      try {
        const response = await axios.get("/api/foglalasok/szolgaltatasok");
        this.szolgaltatasok = response.data;
      } catch (error) {
        console.error("Hiba a szolgáltatások lekérdezésekor:", error);
      }
    },
    async fetchSzabadIdopontok(szolgaltatasId) {
      this.selectedSzolgaltatasId = szolgaltatasId; // Store the selected service ID
      try {
        const response = await axios.get(`/api/foglalasok/szabad-idopontok/${szolgaltatasId}`);
        this.szabadIdopontok = response.data;
        this.modalVisible = true; // Open the modal
      } catch (error) {
        console.error("Hiba a szabad időpontok lekérésekor:", error);
      }
    },

    async bookAppointment() {
      if (this.selectedIdo && this.selectedSzolgaltatasId) {
        try {
          const response = await axios.post('/api/foglalasok/foglalas', {
            szolgaltatas_id: this.selectedSzolgaltatasId,
            ido_id: this.selectedIdo,
            felhasznalo_id: this.getUserId(),
          });

          if (response.data.success || response.data.message) {
            alert("A foglalás sikeresen megtörtént!");
            this.modalVisible = false; // Close the modal
          } else {
            alert('Ez az időpont már foglalt!');
          }
        } catch (error) {
          console.error('Hiba a foglalás során:', error);
          alert('Hiba történt a foglalás során!');
        }
      } else {
        alert('Kérjük válasszon szolgáltatást és időpontot!');
      }
    },
    getUserId() {
      return JSON.parse(localStorage.getItem('authData')).id;
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
  width: 350px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.card h3 {
  margin-bottom: 10px;
}

.card p {
  margin: 5px 0;
}

button {
  padding: 10px;
  background-color: #6b00d0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

button:hover {
  background-color: #7600e5;
  transform: scale(1.05);
}

/* Modal Styles */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  height: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures space between content and button */
}

.foglalas-btn {
  padding: 10px;
  background-color: #6b00d0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  margin-top: auto; /* Pushes the button to the bottom */
}

.foglalas-btn:hover {
  background-color: #7600e5;
  transform: scale(1.05);
}

.close {
  color: black;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: red;
  text-decoration: none;
  cursor: pointer;
}
</style>
