import { reactive } from "vue";

// store.js
export const store = reactive({
  authData: JSON.parse(localStorage.getItem("authData")) || null,

  // Dinamikus getter az isLoggedIn állapothoz
  get isLoggedIn() {
    return !!this.authData;
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
