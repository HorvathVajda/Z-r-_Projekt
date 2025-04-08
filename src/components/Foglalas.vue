<template>
  <div class="services-container">
    <div class="floating-dots">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
    </div>
    <div class="services-content">
      <div class="services-card">
        <div class="services-header">
          <h2>Szolgáltatások</h2>
          <p>Válassza ki a kívánt szolgáltatást</p>
        </div>

        <!-- Rendezés legördülő menü -->
        <div class="filter">
          <label for="sortOptions">Rendezés:</label>
          <div class="input-wrapper">
            <select id="sortOptions" v-model="selectedSortOption" @change="sortServices">
              <option value="nameAsc">Vállalkozás név szerint (ABC, növekvő)</option>
              <option value="nameDesc">Vállalkozás név szerint (ABC, csökkenő)</option>
              <option value="durationAsc">Időtartam szerint (növekvő)</option>
              <option value="durationDesc">Időtartam szerint (csökkenő)</option>
              <option value="priceAsc">Ár szerint (növekvő)</option>
              <option value="priceDesc">Ár szerint (csökkenő)</option>
            </select>
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </span>
          </div>
        </div>

        <div class="cards">
          <div
            v-for="szolgaltatas in szolgaltatasok"
            :key="szolgaltatas.szolgaltatas_id"
            class="service-card"
          >
            <h3>{{ szolgaltatas.szolgaltatas_neve }}</h3>
            <div class="service-details">
              <p><span class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span> {{ szolgaltatas.vallalkozas_neve }}</p>
              <p><span class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span> {{ szolgaltatas.idotartam }} perc</p>
              <p><span class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </span> {{ szolgaltatas.ar }} Ft</p>
            </div>
            <button @click="fetchSzabadIdopontok(szolgaltatas)" class="service-button">
              Szabad időpontok
              <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal for free time slots -->
        <div v-if="modalVisible" class="modal">
          <div class="modal-content">
            <span class="close" @click="modalVisible = false">&times;</span>
            <h3>Szabad időpontok</h3>
            <div class="time-slots">
              <div v-for="ido in szabadIdopontok" :key="ido.ido_id" class="time-slot">
                <input type="radio" :id="'time-' + ido.ido_id" :value="ido.ido_id" v-model="selectedIdo" class="time-radio">
                <label :for="'time-' + ido.ido_id">
                  <span class="time-label">{{ ido.szabad_ido }}</span>
                  <span class="status-badge" :class="{'available': ido.statusz === 'Szabad'}">{{ ido.statusz }}</span>
                </label>
              </div>
            </div>
            <button class="modal-button" @click="bookAppointment" :disabled="!selectedIdo">
              Foglalás
              <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Alert Box -->
        <div v-if="alertMessage" class="alert-box" :class="{'error': alertMessage.includes('Hiba')}">
          <p>{{ alertMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  data() {
    return {
      szolgaltatasok: [],
      modalVisible: false,
      szabadIdopontok: [],
      selectedIdo: null,
      selectedSzolgaltatasId: null,
      vallalkozasId: ref(null),
      alertMessage: null,
      selectedSortOption: "nameAsc",
    };
  },

  mounted() {
    const route = useRoute();
    this.vallalkozasId = route.params.vallalkozas_id || null;
    this.category = route.query.category || '';
    this.fetchSzolgaltatasok(this.vallalkozasId, this.category);
  },

  methods: {
    fetchSzolgaltatasok(vallalkozasId, category) {
      const params = new URLSearchParams();

      if (vallalkozasId) {
        params.append('vallalkozas_id', vallalkozasId);
      }
      if (category) {
        params.append('category', category);
      }

      axios
        .get(`/api/foglalasok/szolgaltatasok?${params.toString()}`)
        .then((response) => {
          this.szolgaltatasok = response.data;
        })
        .catch((error) => {
          console.error("Hiba a szolgáltatások lekérésekor:", error);
        });
    },

    fetchSzabadIdopontok(szolgaltatas) {
      this.selectedSzolgaltatasId = szolgaltatas.szolgaltatas_id;
      this.vallalkozasId = szolgaltatas.vallalkozas_id;

      axios
        .get(`/api/foglalasok/szabad-idopontok/${szolgaltatas.szolgaltatas_id}`)
        .then((response) => {
          this.szabadIdopontok = response.data;
          this.modalVisible = true;
        })
        .catch((error) => {
          console.error("Hiba a szabad időpontok lekérésekor:", error);
          this.showAlert("Hiba történt a szabad időpontok lekérésekor.");
        });
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
        await axios.post('/api/foglalasok/foglalas', payload);
        this.showAlert("Sikeres foglalás!");
        this.modalVisible = false;
      } catch (error) {
        console.error('Hiba a foglalás során:', error);
        this.showAlert("Hiba történt a foglalás során.");
      }
    },

    showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.alertMessage = null;
      }, 5000);
    }
  }
};
</script>

<style scoped>

.services-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;
  background-color: #fafafa;
}

.floating-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dot {
  position: absolute;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.5;
}

.dot-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #c7aaff 0%, rgba(255,182,193,0) 70%);
  top: 10%;
  left: 15%;
  animation: float 45s ease-in-out infinite;
}

.dot-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #c7aaff 0%, rgba(255,105,180,0) 70%);
  bottom: 15%;
  right: 10%;
  animation: float 60s ease-in-out infinite reverse;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(50px, 30px) rotate(5deg);
  }
  50% {
    transform: translate(0, 50px) rotate(0deg);
  }
  75% {
    transform: translate(-30px, 20px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.services-content {
  width: 100%;
 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  backdrop-filter: blur(5px);
  z-index: 1;
  margin: 0 auto;
 
}

.services-card {
  width: 1000px;
  padding: 1.5rem;
}

.services-header {
  margin-bottom: 2rem;
  text-align: center;
}

.services-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
}

.services-header p {
  color: #718096;
  font-size: 0.95rem;
}

.filter {
  margin-bottom: 2rem;
}

.filter label {
  display: block;
  font-size: 0.8rem;
  color: #4a5568;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.filter select {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  transition: all 0.2s;
  background-color: #f8fafc;
  height: 40px;
  appearance: none;
}

.filter select:focus {
  outline: none;
  border-color: rgba(107, 0, 208, 0.2);
  box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.1);
  background-color: #ffffff;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 0.9rem;
  pointer-events: none;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.service-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e2e8f0;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.service-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: black;
  margin-bottom: 1rem;
}

.service-details {
  margin-bottom: 1.5rem;
}

.service-details p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.detail-icon {
  color: #6b00d0;
}

.service-button {
  width: 100%;
  padding: 0.7rem;
  background-color: black;
  color: white;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.service-button:hover {
  background-color: #333;
}

.arrow-icon {
  transition: transform 0.2s;
}

.service-button:hover .arrow-icon {
  transform: translateX(3px);
}

/* Modal Styles */
.modal {
  position: fixed;
  z-index: 100;
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
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: black;
  margin-bottom: 1.5rem;
  text-align: center;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 1.5rem;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s;
}

.close:hover {
  color: #6b00d0;
}

.time-slots {
  margin-bottom: 1.5rem;
}

.time-slot {
  margin-bottom: 0.5rem;
}

.time-radio {
  display: none;
}

.time-radio + label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: all 0.2s;
}

.time-radio:checked + label {
  background-color: #f0f0ff;
  border-color: #6b00d0;
}

.time-label {
  font-size: 0.9rem;
  color: #4a5568;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  background-color: #e2e8f0;
  color: #4a5568;
}

.status-badge.available {
  background-color: #e6ffed;
  color: #2d7a4d;
}

.modal-button {
  width: 100%;
  padding: 0.7rem;
  background-color: black;
  color: white;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modal-button:hover:not(:disabled) {
  background-color: #333;
}

.modal-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

/* Alert Box Styles */
.alert-box {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background-color: #6b00d0;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  animation: slideIn 0.3s ease-out;
}

.alert-box.error {
  background-color: #e53e3e;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .services-content {
    padding: 1rem;
  }
  
  .dot {
    display: none;
  }
  
  .cards {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }
  
  .alert-box {
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    width: auto;
  }
}
</style>