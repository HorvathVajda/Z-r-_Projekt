import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import KapcsolatPage from './components/KapcsolatPage.vue';
import RolunkPage from './components/RolunkPage.vue';
import LoginPage from './components/LoginPage.vue';
import RegistrationPage from './components/RegistrationPage.vue';
import AdatVedelem from './components/AdatVedelem.vue';
import Profil from './components/Profil.vue';

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
    path: '/rolunk',
    name: 'Rolunk',
    component: RolunkPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Registration',
    component: RegistrationPage
  },
  {
    path: '/Adatvedelem',
    name: 'Adatvedelem',
    component: AdatVedelem
  },
  {
    path: '/Profil',
    name: 'Profil',
    component: Profil
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
