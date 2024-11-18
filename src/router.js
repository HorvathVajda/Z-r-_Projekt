import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import KapcsolatPage from './components/KapcsolatPage.vue';
import RolunkPage from './components/RolunkPage.vue';
import LoginPage from './components/LoginPage.vue';
import RegistrationPage from './components/RegistrationPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/kapcsolat',
    name: 'Kapcsolat',
    component: KapcsolatPage
  },
  {
    path: '/rolunk',  // Figyelj arra, hogy az útvonal pontosan egyezzen a linkkel
    name: 'Rolunk',
    component: RolunkPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Registration',
    component: RegistrationPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
