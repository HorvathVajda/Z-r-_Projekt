import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { store } from './store'; // Importáljuk a store-t
import { createVuetify } from 'vuetify'; // Vuetify importálása
import 'vuetify/styles'; // Vuetify stílusok importálása

const app = createApp(App);

const vuetify = createVuetify(); // Vuetify inicializálása

app.config.globalProperties.$store = store; // A store globális elérhetősége
app.use(router); // Router használata
app.use(vuetify); // Vuetify alkalmazása

app.mount('#app');
