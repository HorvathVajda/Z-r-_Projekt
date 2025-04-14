<template>
  <section class="profile-wrapper">
    <div class="card">
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

      <div class="contact-card card">
        <h2>Lépj kapcsolatba velünk!</h2>
        <p>
          Kérdésed van? Ötleted, amit szívesen látnál a rendszerben? Vedd fel velünk a kapcsolatot az <strong>bookmytime884@gmail.com</strong> címen!
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-wrapper {
  max-width: 700px;
  margin: 90px auto;
  padding: 0 20px;
  font-family: "Segoe UI", sans-serif;
  color: #333;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.contact-card {
  background-color: #faf8ff;
  border-left: 4px solid #6327a2;
}

h1 {
  font-size: 28px;
  text-align: center;
  color: rgba(154, 46, 255, 0.8);;
  margin-bottom: 24px;
  font-weight: 600;
}

h2 {
  font-size: 20px;
  color: rgba(154, 46, 255, 0.8);;
  margin-top: 24px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1d5f2;
}

h3 {
  font-size: 17px;
  color: #444;
  margin-bottom: 10px;
}

p {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 16px;
  color: #555;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.features li {
  font-size: 14px;
  margin: 10px 0;
  padding: 12px 16px;
  background-color: #f9f5ff;
  border-left: 3px solid #a271d2;
  border-radius: 8px;
}

.values {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 20px 0;
}

.value-box {
  flex: 1;
  min-width: 200px;
  background-color: #f5f7fa;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

strong {
  color: rgba(154, 46, 255, 0.8);;
}

@media (max-width: 600px) {
  .profile-wrapper {
    margin: 40px auto;
    padding: 0 16px;
  }

  .card {
    padding: 20px;
  }

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 18px;
  }

  .values {
    flex-direction: column;
  }

  .value-box {
    min-width: 100%;
  }
}
</style>