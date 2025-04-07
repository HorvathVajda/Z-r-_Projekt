<template>
  <section class="about-section">
    <div class="about-card">
      <h1>Rólunk</h1>
      <p>
        A <strong>BookMyTime</strong> célja, hogy megkönnyítse a vállalkozások számára az időpontfoglalások kezelését,
        miközben kényelmes és átlátható élményt nyújt az ügyfeleknek is. Hiszünk abban, hogy egy jól működő időpontfoglaló rendszer
        nem csupán időt takarít meg, hanem hozzájárul az üzleti növekedéshez is.
      </p>

      <h2>Kik vagyunk?</h2>
      <p>
        Egy lelkes fejlesztői és üzleti csapat, akik szenvedélyesen dolgoznak azon, hogy a digitális időpontfoglalás mindenki számára elérhető, egyszerű és hatékony legyen.
        Minden nap azon vagyunk, hogy új funkciókkal, jobb felhasználói élménnyel és megbízható szolgáltatással segítsünk ügyfeleinknek.
      </p>

      <h2>Miért válassz minket?</h2>
      <ul class="features">
        <li>✅ Intuitív kezelőfelület: könnyű eligazodni, egyszerű használat</li>
        <li>📆 Foglalási naptár valós idejű frissítésekkel</li>
        <li>📩 Automatikus e-mail és SMS értesítések</li>
        <li>🎯 Teljesen testreszabható időintervallumok</li>
        <li>🔐 Biztonságos adatkezelés, GDPR kompatibilis működés</li>
        <li>📱 Mobilbarát és reszponzív felület</li>
      </ul>

      <h2>Értékeink</h2>
      <div class="values">
        <div class="value-box">
          <h3>Felhasználóközpontúság</h3>
          <p>Minden fejlesztésünknél az első a felhasználó. Az egyszerűség és gyorsaság kulcsfontosságú számunkra.</p>
        </div>
        <div class="value-box">
          <h3>Megbízhatóság</h3>
          <p>Stabil rendszerünk 99.9%-os rendelkezésre állással működik, hogy te mindig számíthass ránk.</p>
        </div>
        <div class="value-box">
          <h3>Innováció</h3>
          <p>Folyamatosan fejlesztjük platformunkat a legújabb technológiák segítségével, hogy mindig egy lépéssel előrébb járjunk.</p>
        </div>
      </div>

      <h2>Küldetésünk</h2>
      <p>
        Egy olyan platformot biztosítani, amely nemcsak technikailag megbízható, hanem valóban segíti a vállalkozások növekedését.
        Legyen szó fodrászatról, masszőrről vagy autószervizről, mi egy olyan digitális asszisztenst nyújtunk,
        amely leveszi a szervezés terhét a válladról.
      </p>

      <h2>Lépj kapcsolatba velünk!</h2>
      <p>
        Kérdésed van? Ötleted, amit szívesen látnál a rendszerben? Vedd fel velünk a kapcsolatot az <strong>bookmytime884@gmail.com</strong> címen!
      </p>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  color: #333;
  border-radius: 10px;
  margin: auto;
  max-width: 960px;
  animation: fadeIn 0.8s ease-in-out;
}

.about-card {
  background-color: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

h1 {
  font-size: 2.5em;
  text-align: center;
  color: #6B00D0;
  margin-bottom: 30px;
}

h2 {
  font-size: 1.8em;
  color: #6B00D0;
  margin-top: 30px;
  margin-bottom: 15px;
  border-bottom: 2px solid #b8860b;
  padding-bottom: 6px;
}

h3 {
  font-size: 1.4em;
  color: #444;
  margin-bottom: 10px;
}

p {
  font-size: 1.15em;
  line-height: 1.8;
  margin-bottom: 15px;
  text-align: justify;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  font-size: 1.1em;
  margin: 10px 0;
  padding: 10px;
  background-color: #f1ecfb;
  border-left: 4px solid #6B00D0;
  border-radius: 8px;
}

.values {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.value-box {
  flex: 1;
  min-width: 260px;
  background-color: #f7f5ff;
  border: 1px solid #ddd;
  border-left: 4px solid #6B00D0;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .about-card {
    padding: 25px;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  p, .features li {
    font-size: 1em;
  }

  .values {
    flex-direction: column;
  }
}
</style>
