<template>
  <br>
  <div class="home-page">
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
          <span></span><span></span><span></span><span></span>

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
            <h4>TESZT</h4>
          </div>
        </div>
        <div class="col-md-4">
          <div class="service-card">
            <i class="fas fa-spa"></i>
            <h4>TESZT</h4>
          </div>
        </div>
        <div class="col-md-4">
          <div class="service-card">
            <i class="fas fa-dumbbell"></i>
            <h4>TESZT</h4>
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

/* Hero szekció */
.hero {
  background: white;
  padding: 60px 0;
  margin-top: 10px;
}

.search-box {
  margin: 0 auto;
}

.custom-btn {
  background-color: gold;
  color: black;
  padding: 0.8em 1.5em;
  border: none;
  border-radius: 0.5em;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.custom-btn:hover {
  background-color: goldenrod;
}

/* Szolgáltatások */
.services {
  background-color: white;
  padding: 3em 1em;
  border-radius: 1em;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.services h3 {
  font-size: 2.5em;
  color: var(--c);
  margin-bottom: 1.5em;
  text-transform: uppercase;
  font-weight: bold;
}

.services .service-card {
  background: white;
  border: 1px solid var(--c);
  color: var(--c);
  font-size: 1.2em;
  border-radius: 1em;
  padding: 2em 1em;
  text-transform: uppercase;
  font-weight: bold;
  font-family: sans-serif;
  letter-spacing: 0.1em;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.services .service-card i {
  font-size: 3em;
  margin-bottom: 0.5em;
  color: var(--c);
  transition: color 0.3s;
}

.services .service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  background-color: var(--c);
  color: black;
}

.services .service-card:hover i {
  color: black;
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
  color: black;
}

.services .service-card h4 {
  margin-top: 10px;
  font-size: 18px;
}
</style>
