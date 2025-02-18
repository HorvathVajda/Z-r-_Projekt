<template>
  <div class="foglalas-container">
    <h1>Foglalás</h1>
    <div v-if="vallalkozasok.length === 0">Nincsenek elérhető vállalkozások.</div>

    <div v-for="vallalkozas in vallalkozasok" :key="vallalkozas.id" class="vallalkozas-card">
      <h2>{{ vallalkozas.vallalkozas_neve }}</h2>
      <p><strong>Helyszín:</strong> {{ vallalkozas.helyszin }}</p>
      <p><strong>Nyitvatartás:</strong> {{ vallalkozas.nyitva_tartas }}</p>

      <h3>Szolgáltatások</h3>
      <ul>
        <li v-for="szolg in vallalkozas.szolgaltatasok" :key="szolg.szolgaltatas_id">
          {{ szolg.szolgaltatas_neve }} - {{ szolg.idotartam }} perc - {{ szolg.ar }} Ft
          <button @click="selectService(vallalkozas.id, szolg.szolgaltatas_id, szolg.szolgaltatas_neve)">Select Service</button>
        </li>
      </ul>

    </div>

    <!-- Kiválasztott szolgáltatás és időpont panel -->
    <div v-if="selectedService" class="foglalas-panel">
      <h2>Foglalás részletei</h2>
      <p><strong>Szolgáltatás:</strong> {{ selectedService.name }}</p>

      <!-- Időpont kiválasztás -->
      <label for="selectedTime">Válassz időpontot:</label>
      <select v-model="selectedTime" id="selectedTime">
        <option v-for="ido in availableTimes" :key="ido.ido_id" :value="ido.szabad_ido">
          {{ ido.szabad_ido }}
        </option>
      </select>

      <button @click="submitBooking">Foglalás megerősítése</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      vallalkozasok: [],   // Az elérhető vállalkozások
      selectedService: null, // Kiválasztott szolgáltatás
      selectedTime: null,   // Kiválasztott időpont
      availableTimes: [],   // Elérhető időpontok a szolgáltatáshoz
    };
  },
  methods: {
    async fetchVallalkozasok() {
      try {
        const response = await axios.get('http://localhost:5000/api/businesses/vallalkozasok');
        this.vallalkozasok = response.data;

        // Ha szükséges, ellenőrizd, hogy a szolgáltatásokat is helyesen töltöd be
        this.vallalkozasok.forEach(vallalkozas => {
          vallalkozas.szolgaltatasok = vallalkozas.szolgaltatasok || [];  // Alapértelmezett üres tömb, ha nincs adat
        });
      } catch (error) {
        console.error("Hiba történt a vállalkozások lekérésekor:", error);
      }
    },

    selectService(vallalkozas_id, szolgaltatas_id, szolgaltatas_neve) {
      if (szolgaltatas_id && szolgaltatas_id !== undefined && szolgaltatas_id !== null) {
        this.selectedService = { id: szolgaltatas_id, name: szolgaltatas_neve };
        this.fetchAvailableTimes(vallalkozas_id, szolgaltatas_id);
      } else {
        console.error("Szolgáltatás ID hiányzik!");
      }
    },

    async fetchAvailableTimes(vallalkozas_id, szolgaltatas_id) {
      if (!vallalkozas_id || !szolgaltatas_id) {
        console.error("Hibás paraméterek a lekérdezéshez:", vallalkozas_id, szolgaltatas_id);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/businesses/ido/${vallalkozas_id}/${szolgaltatas_id}`);
        this.availableTimes = response.data;
      } catch (error) {
        console.error("Hiba történt az elérhető időpontok lekérésekor:", error);
      }
    },

    submitBooking() {
      if (!this.selectedTime) {
        alert("Kérlek, válassz időpontot!");
        return;
      }

      const bookingData = {
        szolgaltatas_id: this.selectedService.id,
        idopont: this.selectedTime,
        felhasznalo_id: 1, // Cseréld ki az aktuális felhasználó ID-jére
        statusz: 'pending', // Alapértelmezett státusz
      };

      axios.post("http://localhost:5000/api/businesses/foglalas", bookingData)
        .then(response => {
          alert(response.data.message);
          this.selectedService = null; // Töröljük a kiválasztott szolgáltatást
          this.selectedTime = null;   // Töröljük a kiválasztott időpontot
        })
        .catch(error => {
          console.error("Hiba történt a foglalás mentésekor:", error);
        });
    },
  },
  mounted() {
    this.fetchVallalkozasok();
  },
};
</script>

<style scoped>
.foglalas-container {
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 80px;
}

.vallalkozas-card {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.foglalas-panel {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

button {
  background-color: #6327A2;
  color: white;
  border: none;
  padding: 8px 16px;
  text-align: center;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.5s, transform 0.4s;
  margin: 3px;
  margin-left: 10px;
}

button:hover {
  background-color: #9d9ff4;
  transform: translateX(5%);
}

select {
  padding: 8px;
  font-size: 16px;
  margin-top: 10px;
  width: 100%;
}

h2, h3 {
  margin-bottom: 10px;
}

label {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>
