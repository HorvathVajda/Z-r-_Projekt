import { reactive } from "vue";

export const store = reactive({
  authData: JSON.parse(localStorage.getItem("authData")) || null,
});
