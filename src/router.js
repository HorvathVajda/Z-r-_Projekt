import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import KapcsolatPage from './components/KapcsolatPage.vue';
import RolunkPage from './components/RolunkPage.vue';
import LoginPage from './components/LoginPage.vue';
import RegistrationPage from './components/RegistrationPage.vue';
import AdatVedelem from './components/AdatVedelem.vue';
import Profil from './components/Profil.vue';
import vallalkozoHome from './components/vallalkozoHome.vue';
import registerChoose from './components/registerChoose.vue';
import vallalkozoRegister from './components/vallalkozoRegister.vue';
import Dashboard from './components/Dashboard.vue';
import Foglalas from './components/Foglalas.vue';
import businessCard from './components/businessCards.vue';
import felhasznaloHome from  './components/felhasznaloHome.vue';
import BusinessDetails from './components/BusinessDetails.vue';
import felhasznaloProfil from './components/felhasznaloProfil.vue';

const routes = [
  { path: '/kapcsolat', name: 'Kapcsolat', component: KapcsolatPage },
  { path: '/rolunk', name: 'Rolunk', component: RolunkPage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'Registration', component: RegistrationPage },
  { path: '/Adatvedelem', name: 'Adatvedelem', component: AdatVedelem },
  { path: '/registerChoose', name: 'registerChoose', component: registerChoose },
  { path: '/vallalkozoRegister', name: 'vallalkozoRegister', component: vallalkozoRegister },
  { path: '/foglalas/:vallalkozas_id?/:category?', name: 'Foglalas', component: Foglalas, props: true },

  {
    path: '/',
    component: HomePage,
    children: [
      { path: '', name: 'Businesscards', component: businessCard },
    ]
  },

  {
    path: '/vallalkozoHome',
    component: vallalkozoHome,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'profil', name: 'Profil', component: Profil },
      { path: 'ceg/:id', name: 'CegProfil', component: BusinessDetails, props: true},
    ]
  },

  {
    path: '/felhasznaloHome',
    component: felhasznaloHome,
    children: [
      { path: 'Profil', name: 'felhasznaloProfil', component: felhasznaloProfil },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
