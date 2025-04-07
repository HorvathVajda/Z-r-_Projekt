<template>
  <section class="aszf-container">
    <div class="aszf-card">
      <h1>Általános Szerződési Feltételek (ÁSZF)</h1>
      <h2 id="hatalyos">Hatályos: 2024. Szeptember 01.</h2>

      <div class="aszf-section">
        <p>
          Jelen Általános Szerződési Feltételek (ÁSZF) a BookMyTime által nyújtott online időpontfoglaló rendszer igénybevételének feltételeit tartalmazza. A rendszer használatával Ön elfogadja az alábbi feltételeket.
        </p>

        <h2>1. Szolgáltató adatai</h2>
        <ul>
          <li><strong>Szolgáltató neve:</strong> BookMyTime</li>
          <li><strong>Székhely:</strong> Városföld Béke utca 2.</li>
          <li><strong>Adószám:</strong> [Ha van]</li>
          <li><strong>Kapcsolattartó e-mail:</strong> bookmytime884@gmail.com</li>
          <li><strong>Kapcsolattartó telefonszám:</strong> [Telefonszám]</li>
        </ul>

        <h2>2. A szolgáltatás célja</h2>
        <p>
          A Book My Time egy online platform, amely lehetővé teszi vállalkozások számára, hogy időpontokat kezeljenek, és lehetővé teszi az ügyfelek számára, hogy ezen vállalkozásokhoz időpontot foglaljanak.
        </p>

        <h2>3. Regisztráció és felhasználói fiók</h2>
        <p><strong>Szolgáltatók számára:</strong> Regisztráció után a vállalkozások (pl. fodrászok, autószerelők) saját időpontfoglalási rendszert hozhatnak létre. A szolgáltató köteles biztosítani a megadott adatok helyességét és naprakészségét.</p>
        <p><strong>Ügyfelek számára:</strong> Az ügyfelek regisztrációval vagy vendégként is foglalhatnak időpontot. A foglaláshoz szükséges valós adatok megadása kötelező.</p>

        <h2>4. Időpontfoglalás</h2>
        <p>Az ügyfelek a rendszer segítségével valós időben választhatnak elérhető időpontokat. Az időpont foglalás sikerességéről e-mailben vagy más értesítési módon kapnak visszaigazolást.</p>

        <h2>5. Lemondás és módosítás</h2>
        <p>Az időpontok lemondására vagy módosítására az időpont előtt legkésőbb [XX óra/nappal] van lehetőség. A rendszer automatikusan zárolja a módosítás lehetőségét a határidő után.</p>

        <h2>6. Díjazás és fizetési feltételek</h2>
        <p>Az ügyfelek a foglaláskor előleget vagy teljes összeget fizethetnek online. A fizetés bankkártyával vagy más online módszerrel történik. Lemondás esetén az előleg visszatérítésére a szolgáltató szabályai vonatkoznak.</p>

        <h2>7. Felelősség kizárása</h2>
        <p>A szolgáltató nem vállal felelősséget adatbeviteli hibákért vagy technikai problémákért. Hibák esetén kérjük, lépjen velünk kapcsolatba: <strong>bookmytime884@gmail.com</strong>.</p>

        <h2>8. Adatvédelem</h2>
        <p>Az adatokat bizalmasan kezeljük. Harmadik félnek csak jogszabályban előírt esetekben adjuk ki. További információ az Adatvédelmi Szabályzatban.</p>

        <h2>9. Szerződés megszüntetése</h2>
        <p>Az ügyfelek bármikor megszüntethetik regisztrációjukat. A szolgáltató fenntartja a jogot a fiókok törlésére, ha a felhasználók megszegik az ÁSZF-et.</p>

        <h2>10. Egyéb rendelkezések</h2>
        <p>A szolgáltató fenntartja a jogot az ÁSZF módosítására. Az ilyen módosításról a felhasználókat legalább 14 nappal előtte értesítjük.</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style scoped>
.aszf-container {
  padding: 40px 20px;
  background-color: #f0f4fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.aszf-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2e2e2e;
}

h1 {
  font-size: 2.2em;
  font-weight: bold;
  color: #6b00d0;
  text-align: center;
  margin-bottom: 10px;
}

#hatalyos {
  text-align: center;
  font-size: 1.1em;
  color: #777;
  margin-bottom: 30px;
}

h2 {
  font-size: 1.4em;
  color: #6b00d0;
  margin-top: 30px;
  border-left: 5px solid #6b00d0;
  padding-left: 10px;
}

p {
  font-size: 1.05em;
  line-height: 1.6;
  text-align: justify;
  margin: 12px 0;
}

ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 20px;
}

ul li {
  margin: 6px 0;
  padding-left: 16px;
  position: relative;
}

ul li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #6b00d0;
  font-weight: bold;
}

strong {
  font-weight: 600;
  color: #444;
}

@media (max-width: 768px) {
  .aszf-card {
    padding: 25px;
  }

  h1 {
    font-size: 1.7em;
  }

  h2 {
    font-size: 1.2em;
  }

  p {
    font-size: 1em;
  }
}
</style>
