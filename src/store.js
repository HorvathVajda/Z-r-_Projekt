import { reactive, computed } from "vue";

// store.js
export const store = reactive({
  authData: JSON.parse(localStorage.getItem("authData")) || null,
  isLoggedIn: computed(() => !!store.authData),
  vallalkozo: computed(() => store.authData?.tipus === "vallalkozo"),
  felhasznalo: computed(() => store.authData?.tipus === "felhasznalo"),

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
