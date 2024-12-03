import { reactive } from "vue";

export const store = reactive({
  isLoggedIn: !!localStorage.getItem("token"), // Ellenőrzi, hogy van-e token

  // Funkció a bejelentkezési állapot frissítésére
  logIn(token) {
    this.isLoggedIn = true;
    localStorage.setItem("token", token); // Token tárolása
  },

  logOut() {
    this.isLoggedIn = false;
    localStorage.removeItem("token"); // Token törlése
  },
});
