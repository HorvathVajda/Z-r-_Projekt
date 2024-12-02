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

    <section class="testimonials text-center py-5">
      <h3>Vélemények</h3>
      <div class="row mt-4">
        <div class="col-md-4">
          <div class="testimonial-card">
            <p>"Nagyon elégedett voltam a szolgáltatással!"</p>
            <h5>- Péter</h5>
          </div>
        </div>
        <div class="col-md-4">
          <div class="testimonial-card">
            <p>"Profik, gyorsak és segítőkészek!"</p>
            <h5>- Anna</h5>
          </div>
        </div>
        <div class="col-md-4">
          <div class="testimonial-card">
            <p>"Mindenkinek ajánlom őket!"</p>
            <h5>- Gábor</h5>
          </div>
        </div>
      </div>
    </section>


    <section class="cta text-center py-5">
      <h3>Foglalj most, és élvezd a szolgáltatásokat!</h3>
      <router-link class="linkek" to="/register">Regisztrálj itt!</router-link>
      <p>vagy</p>
      <router-link class="linkek" to="/login">Belépés</router-link>
    </section>

    <!-- Map Section -->
    <section class="map-section py-5">
      <h3>Találd meg a legközelebbi szolgáltatót!</h3>
      <div id="map"></div>
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

/* Testimonials */
.testimonials {
  background-color: #f9f9f9;
  padding: 2em 1em;
}

.testimonial-card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 1.5em;
  border-radius: 1em;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.testimonial-card p {
  font-style: italic;
  font-size: 1.1em;
}

.testimonial-card h5 {
  margin-top: 10px;
  font-weight: bold;
  font-size: 1.2em;
}

/* CTA */
.cta {
  background-color: white;
  color: black;
  padding: 3em 1em;
  border-radius: 1em;
  text-align: center;
}

.cta-btn {
  background-color: gold;
  color: black;
  padding: 15px 30px;
  font-size: 1.2em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-btn:hover {
  background-color: goldenrod;
}

/* Style for the registration and login links */
.linkek {
  font-size: 1.2em;
  text-decoration: none;
  color: var(--c); /* Use a primary color for consistency */
  font-weight: bold;
  transition: color 0.3s, transform 0.3s;
}

.linkek:hover {
  color: goldenrod; /* Change to a hover color (or customize) */
  transform: scale(1.1); /* Slightly enlarge the text when hovered */
}

.linkek:focus {
  outline: none; /* Remove the default focus outline */
}

/* Centering the "vagy" text and styling */
p {
  display: inline-block;
  font-size: 1.2em;
  margin: 0 15px;
  color: #555;
}


/* Map */
.map-section {
  background-color: #f9f9f9;
  padding: 2em 1em;
  text-align: center;
}

#map {
  width: 100%;
  height: 300px;
  background-color: #ccc;
  border-radius: 10px;
}

</style>
