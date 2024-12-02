import { createStore } from 'vuex';

const store = createStore({
  state: {
    isLoggedIn: false,
    userEmail: null,
  },
  mutations: {
    setLoggedIn(state, status) {
      state.isLoggedIn = status;
    },
    setUserEmail(state, email) {
      state.userEmail = email;
    },
  },
});

export default store;
