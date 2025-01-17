<template>
  <div class="about-container">
    <div class="about-card">
      <h2>Rólunk</h2>
      <p>
        Üdvözöljük a <strong>BookMyTime</strong> oldalán, a vállalkozások számára készült korszerű időpontfoglaló rendszerben!
        Mi azon dolgozunk, hogy segítsünk a vállalkozásoknak egyszerűsíteni az ügyfeleik időpontfoglalását és kezelését.
      </p>
      <p>
        A célunk, hogy a foglalási folyamat gyors, egyszerű és zökkenőmentes legyen, miközben Ön a vállalkozásának növekedésére koncentrálhat.
      </p>
      <h3>Miért válasszon minket?</h3>
      <ul>
        <li>Egyszerű és intuitív kezelőfelület</li>
        <li>Automatikus értesítések az ügyfeleknek</li>
        <li>Teljesen testreszabható időpontfoglalás</li>
      </ul>
      <h3>Mi a célunk?</h3>
      <p>
        A megbízhatóság és a könnyű használhatóság biztosítása, miközben folyamatosan alkalmazkodunk az új igényekhez és technológiákhoz.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/aboutus.jpg') no-repeat center center/cover; /* Lokális kép */
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.about-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.3); /* Áttetsző háttér */
  backdrop-filter: blur(10px); /* Homályosítás */
  padding: 2rem;
  border-radius: 20px; /* Lekerekített sarkok */
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2),
              0 4px 10px rgba(0, 0, 0, 0.2); /* Fényes árnyék */
  max-width: 800px;
  width: 100%;
  animation: fadeIn 1s ease-in-out;
}

.about-card h2 {
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6); /* Szöveg árnyék */
}

.about-card h3 {
  font-size: 1.8rem;
  color: #e0e0e0;
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* Szöveg árnyék */
}

.about-card p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #f0f0f0;
  margin-bottom: 1rem;
}

.about-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.about-card ul li {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15); /* Enyhén áttetsző elem */
  border-radius: 10px;
  transition: background-color 0.3s ease;
  color: #ffffff;
}

.about-card ul li:hover {
  background: rgba(255, 255, 255, 0.25); /* Világosabb hover */
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
</style>
