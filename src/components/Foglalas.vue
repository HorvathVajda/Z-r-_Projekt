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
            <button @click="foglalas(vallalkozas.id, szolg.szolgaltatas_id)">Foglalás</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        vallalkozasok: []
      };
    },
    methods: {
        async fetchVallalkozasok() {
        try {
            const response = await axios.get('http://localhost:5000/api/businesses/vallalkozasok');
            this.vallalkozasok = response.data;
        } catch (error) {
            console.error("Hiba történt a vállalkozások lekérésekor:", error);
        }
    },
      foglalas(vallalkozas_id, szolgaltatas_id) {
        alert(`Foglalás elküldve vállalkozás ID: ${vallalkozas_id}, szolgáltatás ID: ${szolgaltatas_id}`);
        // Ide jöhet majd az API hívás a foglalás mentéséhez
      }
    },
    mounted() {
      this.fetchVallalkozasok();
    }
  };
  </script>
  
  <style scoped>
  .foglalas-container {
    margin-top: 80px;
    color: black;
    background: #fff;
    padding: 20px;
    min-height: 100vh;
  }
  
  .vallalkozas-card {
    background: white;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }
  
  button {
    background: #6327A2;
    color: white;
    border: none;
    padding: 8px 12px;
    margin-top: 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: 0.3s;
  }
  
  button:hover {
    background: #45a049;
  }
  </style>
  