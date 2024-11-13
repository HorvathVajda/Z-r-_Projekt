<template>
  <div class="home-page">
    <!-- Cookie Consent -->
    <div v-if="showCookieConsent" id="cookie-consent">
      <p>Az oldal sütiket használ a jobb felhasználói élmény érdekében.</p>
      <button @click="acceptCookies" id="accept-btn">OK</button>
    </div>

    <!-- Hero Section -->
    <section class="hero text-center">
      <h2>Kezdj el foglalni most!</h2>
      <div class="search-box mt-4">
        <form id="searchForm" class="d-flex justify-content-center">
          <input type="text" class="form-control mx-1" placeholder="Szolgáltatás" />
          <input type="text" class="form-control mx-1" placeholder="Helyszín" />
          <input type="date" class="form-control mx-1" />
          <input type="time" class="form-control mx-1" />
          <button type="submit" class="custom-btn">Keress</button>
          <button type="submit" class="custom-btn">
          <span></span><span></span><span></span><span></span>
    Keresés
</button>

        </form>
      </div>
    </section>

    <!-- Szolgáltatások -->
    <section class="services container text-center py-5">
      <h3>Népszerű Szolgáltatások</h3>
      <div class="row mt-4">
        <div class="col-md-4">
          <div class="service-card">
            <i class="fas fa-cut"></i>
            <h4>Fodrászat</h4>
          </div>
        </div>
        <div class="col-md-4">
          <div class="service-card">
            <i class="fas fa-spa"></i>
            <h4>Spa</h4>
          </div>
        </div>
        <div class="col-md-4">
          <div class="service-card">
            <i class="fas fa-dumbbell"></i>
            <h4>Edzőterem</h4>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      showCookieConsent: true, // Cookie consent kezdetben látható
    };
  },
  methods: {
    acceptCookies() {
      this.showCookieConsent = false; // Elrejti a cookie consentet
    },
  },
};
</script>

<style scoped>
/* Cookie consent */
#cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8d7da;
  color: #721c24;
  text-align: center;
  padding: 10px;
  z-index: 9999;
}

#cookie-consent p {
  margin: 0;
}

#accept-btn {
  background-color: #28a745;
  border: none;
  padding: 5px 15px;
  color: white;
  cursor: pointer;
}


/* Hero szekció */
.hero {
  background: #f8f9fa;
  padding: 60px 0;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
}

.custom-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-btn:hover {
  background-color: #0056b3;
}

/* Szolgáltatások */
.services .service-card {
  background: #f1f1f1;
  border: 1px solid #ddd;
    --c: goldenrod;
    color: var(--c);
    font-size: 16px;
    border: 0.3em solid var(--c);
    border-radius: 0.5em;
    width: 50em;
    height: 3.5em;
    text-transform: uppercase;
    font-weight: bold;
    font-family: sans-serif;
    letter-spacing: 0.1em;
    text-align: center;
    line-height: 3em;
    position: relative;
    overflow: hidden;
    z-index: 1;
    transition: 0.5s;
    margin: 1em;
    background: none;
    cursor: pointer;
}

.custom-btn span {
    position: absolute;
    width: 25%;
    height: 100%;
    background-color: var(--c);
    transform: translateY(150%);
    border-radius: 50%;
    left: calc((var(--n) - 1) * 25%);
    transition: 0.5s;
    transition-delay: calc((var(--n) - 1) * 0.1s);
    z-index: -1;
}

.custom-btn:hover {
    color: black;
}

.custom-btn:hover span {
    transform: translateY(0) scale(2);
}

.custom-btn span:nth-child(1) {
    --n: 1;
}

.custom-btn span:nth-child(2) {
    --n: 2;
}

.custom-btn span:nth-child(3) {
    --n: 3;
}

.custom-btn span:nth-child(4) {
    --n: 4;
}



/* Szolgáltatások */
.services .service-card {
  background: #f1f1f1;
  border: 1px solid black;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
}

.services .service-card i {
  font-size: 40px;
  color: #007bff;
  color: goldenrod;
}

.services .service-card h4 {
  margin-top: 10px;
  font-size: 18px;
}
</style>
