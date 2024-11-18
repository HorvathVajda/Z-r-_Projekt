<template>
  <div class="about-container">
    <div class="about-content">
      <h2>Rólunk</h2>
      <p>
        Üdvözöljük a <strong>BookMyTime</strong> oldalán, a vállalkozások számára készült korszerű időpontfoglaló rendszerben!
        Mi azon dolgozunk, hogy segítsünk a vállalkozásoknak egyszerűsíteni az ügyfeleik időpontfoglalását és kezelését.
        Legyen szó fodrászról, autószerelőről vagy bármilyen más szolgáltatásról, mi biztosítjuk, hogy a foglalási folyamat gyors, egyszerű és zökkenőmentes legyen.
      </p>
      <p>
        A <strong>BookMyTime</strong> rendszer célja, hogy segítse a kis- és középvállalkozásokat a napi munkamenetük hatékony kezelésében.
        Az egyszerű kezelőfelület, az automatikus értesítések és a testreszabható időpontfoglalás biztosítja, hogy Önnek több ideje maradjon a vállalkozásának növekedésére.
      </p>
      <p>
        Miért válasszon minket? Mert egyszerű, intuitív, és segít abban, hogy ügyfelei mindig a megfelelő időpontban érkezzenek, Ön pedig könnyedén menedzselhesse az összes foglalást!
      </p>
      <h3>Mi a célunk?</h3>
      <p>
        A célunk, hogy a vállalkozások számára egy megbízható, könnyen használható platformot kínáljunk, amely lehetővé teszi számukra a hatékony időpontkezelést.
        Emellett biztosítjuk, hogy a rendszer folyamatosan fejlődjön és alkalmazkodjon az új igényekhez és technológiákhoz.
      </p>
    </div>
  </div>
</template>

<script setup>
// Itt bármilyen szükséges logikát hozzáadhatsz, például adatkezelés
</script>

<style scoped>
/* Az oldal tartalmát a navbar magasságához igazítjuk */
.about-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  padding-top: 100px; /* Eltolás a navbar magassága + extra margó */
}

.about-content {
  background-color: white;
  border: 3px solid black; /* Fekete szegély */
  border-radius: 0.5em;
  padding: 2em;
  text-align: center;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.about-content h2 {
  font-size: 2.2em;
  color: black;
  font-weight: bold;
  margin-bottom: 1.5em;
}

.about-content h3 {
  font-size: 1.8em;
  color: black;
  font-weight: bold;
  margin-top: 2em;
}

.about-content p {
  font-size: 1.2em;
  line-height: 1.6;
  color: black;
  margin-bottom: 1.5em;
}

.about-content p:last-of-type {
  margin-bottom: 0;
}
</style>
