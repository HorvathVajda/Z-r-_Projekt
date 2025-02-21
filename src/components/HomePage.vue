<template>
  <div class="harmadik-container">
      <img src="/hatter3.jpg" alt="Vállalkozóknak" class="harmadik-image" />
      <div class="harmadik-info-box">
        <h2>Foglaljon most időpontot</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla alias, ad quae nisi recusandae officiis sapiente fuga, similique incidunt fugiat ducimus dolores iure nesciunt quam facilis. Quam tempora temporibus possimus!</p>
        <div class="gombok">
          <a @click="goToBooking" class="home-button">Foglaljon most</a>
          <a v-if="!isLoggedIn" @click="goToRegister" class="home-button-register">Regisztráció</a>
        </div>
      </div>
  </div>

  <div class="user-container">
    <div class="image-container">
      <img src="/hatter.jpg" alt="Kép" class="background-image" />
      <div class="info-box">
        <h2>Ügyfeleknek</h2>
        <p>Foglalj időpontot online, keresd meg a legjobb helyeket a környéken, és kezeld a foglalásaidat egy helyen</p>
        <input v-if="!isLoggedIn" @click="goToRegister" type="button" class="user-button" value="Regisztráció">
        <p>Ha van már fiókja:</p>
        <input v-if="!isLoggedIn" @click="goToLogin" type="button" class="user-button" value="Bejelentkezés">
      </div>
    </div>
  </div>

  <div class="business-container">
    <img src="/hatter2.jpg" alt="Vállalkozóknak" class="business-image" />
    <div class="business-info-box">
      <h2>Vállalkozóknak</h2>
      <p>Ideális szolgáltatók számára, mint például fodrászok, autószerelők, kozmetikusok és még sok más!</p>
    </div>
    <div class="business-help-box">
      <p>Eljött az idő, hogy vállalkozásai időpontjait egy helyről könnyedén és egyszerűen kezelje!</p>
      <p>Kezdje el pár egyszerű lépésben:</p>
      <input v-if="!isLoggedIn" @click="goToRegister" type="button" class="business-button" value="Regisztráció">
      <p>Ha van már fiókja:</p>
      <input v-if="!isLoggedIn" @click="goToLogin" type="button" class="business-button" value="Bejelentkezés">
    </div>
  </div>

  <LabelLec />
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from 'axios';
import { store } from "../store";

export default {
  setup() {
    const isLoggedIn = computed(() => store.isLoggedIn);
    const businesses = ref([]);
    const router = useRouter();

    const fetchBusinesses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/businesses");
        businesses.value = response.data;
      } catch (error) {
        console.error("Hiba a vállalkozások lekérésekor:", error);
      }
    };

    const goToLogin = () => {
      router.push("/login");
    };

    const goToRegister = () => {
      router.push("/registerChoose");
    };

    const goToBooking = () => {
      if(!isLoggedIn){
        router.push(`/foglalas`);
      }
      else{
        router.push("/login");
      }
    };

    onMounted(fetchBusinesses);

    return { isLoggedIn, goToLogin, goToRegister, goToBooking, businesses };
  },
};
</script>

<style scoped>
/* Alap stílusok */
.gombok {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
}


.home-button, .home-button-register {
  font-size: 20px;
  font-weight: bold;
  padding: 0.55rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 25px;
  text-decoration: none;
}

.home-button {
  background-color: #9d9ff4;
  color: white;
}

.home-button-register {
  background: transparent;
  color: #6bb6ea;
  text-decoration: none;
}
.user-button{
  background-color: #6327A2;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 0.55rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 25px;
  margin-bottom: 10px;
}

.business-button{
  background-color: black;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 0.55rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 25px;
  margin-bottom: 10px;
}

/* Konténerek és képek */
.user-container, .business-container, .harmadik-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
  position: relative;
}

.image-container, .business-container, .harmadik-container {
  flex: 1;
}

.background-image, .business-image, .harmadik-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-box, .business-info-box, .harmadik-info-box, .business-help-box {
  position: absolute;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.business-info-box{
  bottom: 30%;
  left: 20%;
  transform: translate(-50%, -50%);
  color: black;
  max-width: 450px;
}

.business-help-box{
  top: 25%;
  right: 20%;
  transform: translate(50%, 50%);
  color: black;
  max-width: 4500px;
}
.info-box {
  top: 45%;
  right: 20%;
  transform: translate(-50%, -50%);
  color: white;
  max-width: 500px;
}

.info-box h2, .business-info-box h2, .harmadik-info-box h2 {
  font-size: 40px;
}

.info-box p, .business-info-box p, .harmadik-info-box p {
  font-size: 20px;
}

/* Harmadik konténer speciális stílusai */
.harmadik-info-box {
  top: 50%;
  left: 20%;
  transform: translate(-50%, -50%);
  color: #9d9ff4;
  text-align: left;
  max-width: 550px;
  margin-left: 60px;
}

.harmadik-info-box h2 {
  font-size: 70px;
  margin-bottom: 35px;
}

.harmadik-info-box p {
  font-size: 22px;
  color: #6bb6ea;
  text-align: center;
}

/* Reszponzív beállítások */
@media screen and (max-width: 768px) {
  /* Képernyő szélessége 768px alatt */
  .user-container, .business-container, .harmadik-container {
    flex-direction: column;
    padding: 10px;
  }

  .info-box, .business-info-box, .harmadik-info-box {
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    width: 100%;
    max-width: none;
    margin: 0;
  }

  .info-box h2, .business-info-box h2, .harmadik-info-box h2 {
    font-size: 28px;
  }

  .info-box p, .business-info-box p, .harmadik-info-box p {
    font-size: 16px;
  }

  .gombok {
    flex-direction: column;
    gap: 10px;
  }

  .home-button, .home-button-register {
    font-size: 18px;
    padding: 0.45rem 1rem;
  }

  .harmadik-info-box {
    margin-left: 0;
    text-align: center;
  }

  .harmadik-info-box h2 {
    font-size: 50px;
  }

  .harmadik-info-box p {
    font-size: 18px;
  }
}

@media screen and (max-width: 480px) {
  /* Képernyő szélessége 480px alatt (mobil) */
  .info-box h2, .business-info-box h2, .harmadik-info-box h2 {
    font-size: 24px;
  }

  .info-box p, .business-info-box p, .harmadik-info-box p {
    font-size: 14px;
  }

  .home-button, .home-button-register {
    font-size: 16px;
    padding: 0.35rem 0.8rem;
  }
}

</style>
