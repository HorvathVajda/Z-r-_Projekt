import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { store } from './store'; // Importáljuk a store-t

const app = createApp(App);
app.use(store); // Store használata
app.config.globalProperties.$store = store; // A store globális elérhetősége
app.use(router); // Router használata
app.mount('#app');
