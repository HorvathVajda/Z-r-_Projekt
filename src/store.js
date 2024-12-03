import { reactive } from "vue";

// store.js
export const store = reactive({
  authData: JSON.parse(localStorage.getItem("authData")) || null, // Kezdőérték a localStorage-ból

  // Frissíti az authData-t és a localStorage-ban tárolt adatokat
  updateAuthData(data) {
    this.authData = data;
    localStorage.setItem("authData", JSON.stringify(data)); // Frissíti a localStorage-t
  },

  // Az authData változása
  initialize() {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem("authData"));
    if (dataFromLocalStorage) {
      this.authData = dataFromLocalStorage;
    }
  },
});

// Inicializálás és figyelés a komponens indításakor
store.initialize();
