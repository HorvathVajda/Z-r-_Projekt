import { reactive } from "vue";

// store.js
export const store = reactive({
  authData: JSON.parse(localStorage.getItem("authData")) || null,

  // Getter, amely a 'authData' alapján adja vissza a bejelentkezett állapotot
  get isLoggedIn() {
    return !!this.authData; // Ha authData nem null, akkor be van jelentkezve
  },

  // Frissíti az authData-t és a localStorage-ban tárolt adatokat
  updateAuthData(data) {
    this.authData = data;
    localStorage.setItem("authData", JSON.stringify(data));
  },

  // Törli az authData-t kijelentkezéskor
  clearAuthData() {
    this.authData = null;
    localStorage.removeItem("authData");
  },
});
