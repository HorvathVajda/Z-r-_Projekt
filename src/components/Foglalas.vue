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

    <!-- Error/Info Box -->
    <div v-if="alertMessage" class="alert-box">
      <p>{{ alertMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  data() {
    return {
      szolgaltatasok: [],
      modalVisible: false,
      szabadIdopontok: [],
      selectedIdo: null,
      selectedSzolgaltatasId: null,
      vallalkozasId: null,
      alertMessage: null,
    };
  },
  mounted() {
    const route = useRoute();
    const router = useRouter();
    this.vallalkozasId = this.$route.params.vallalkozas_id;
    console.log('Vállalkozás ID:', this.vallalkozasId);

    // Ha nincs vállalkozás ID, akkor az összes szolgáltatást lekéri
    this.fetchSzolgaltatasok(this.vallalkozasId);
  },
  methods: {
    async fetchSzolgaltatasok(vallalkozasId) {
      try {
        let url = "/api/foglalasok/szolgaltatasok";
        if (vallalkozasId) {
          url += `/${vallalkozasId}`;
        }

        const response = await fetch(url);
        this.szolgaltatasok = await response.json();
      } catch (error) {
        console.error("Hiba a szolgáltatások lekérésekor:", error);
      }
    },
    async fetchSzabadIdopontok(szolgaltatasId) {
      this.selectedSzolgaltatasId = szolgaltatasId;
      try {
        const token = JSON.parse(localStorage.getItem('authData')).token;
        const response = await axios.get(`/api/foglalasok/szabad-idopontok/${szolgaltatasId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.szabadIdopontok = response.data;
        this.modalVisible = true;
      } catch (error) {
        console.error("Hiba a szabad időpontok lekérésekor:", error);
        this.showAlert("Hiba történt a szabad időpontok lekérésekor.");
      }
    },

    async bookAppointment() {
      if (!this.selectedIdo) {
        this.showAlert('Válassz egy szabad időpontot!');
        return;
      }

      const authData = JSON.parse(localStorage.getItem('authData'));
      const userId = authData.id;
      const foglaloTipus = authData.tipus;
      const email = authData.email || '';

      if (!userId || !foglaloTipus) {
        this.showAlert('Nem vagy bejelentkezve!');
        return;
      }

      const payload = {
        szolgaltatas_id: this.selectedSzolgaltatasId,
        ido_id: this.selectedIdo,
        felhasznalo_id: userId,
        vallalkozas_id: this.vallalkozasId,
        foglalo_tipus: foglaloTipus,
        email: email
      };

      try {
        const response = await axios.post('/api/foglalasok/foglalas', payload, {
          timeout: 5000
        });

        this.showAlert("Sikeres foglalás!");
        this.modalVisible = false;
      } catch (error) {
        console.error('Hiba a foglalás során:', error);
        this.showAlert("Hiba történt a foglalás során.");
      }
    },

    // Alert Message Setter
    showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.alertMessage = null;  // Üzenet eltűnik 5 másodperc után
      }, 5000);
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 2000px;
  margin: auto;
  background-color: white;
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
  background: white;
  color: black;
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
  justify-content: space-between;
}

.foglalas-btn {
  padding: 10px;
  background-color: #6b00d0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform none, background-color 0.3s ease;
  margin-top: auto;
}

.foglalas-btn:hover {
  background-color: #7600e5;
  transform: none;
}

.close {
  color: black;
  font-size: 50px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: red;
  text-decoration: none;
  cursor: pointer;
}

/* Alert Box Styles */
.alert-box {
  position: fixed;
  bottom: 20px;  /* Set the box to the bottom */
  left: 20px;    /* Set the box to the left */
  background-color: #ffcc00;
  color: black;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
}
</style>
