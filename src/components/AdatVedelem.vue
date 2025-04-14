<template>
  <section class="profile-wrapper">
    <div class="card">
      <h1>Általános Szerződési Feltételek (ÁSZF)</h1>
      <p class="effective-date">Hatályos: 2024. Szeptember 01.</p>

      <div class="aszf-content">
        <p class="intro">
          Jelen Általános Szerződési Feltételek (ÁSZF) a BookMyTime által nyújtott online időpontfoglaló rendszer igénybevételének feltételeit tartalmazza. A rendszer használatával Ön elfogadja az alábbi feltételeket.
        </p>

        <div class="section">
          <h2>1. Szolgáltató adatai</h2>
          <ul class="provider-data">
            <li><span class="label">Szolgáltató neve:</span> BookMyTime</li>
            <li><span class="label">Székhely:</span> Városföld Béke utca 2.</li>
            <li><span class="label">Adószám:</span> [Ha van]</li>
            <li><span class="label">Kapcsolattartó e-mail:</span> bookmytime884@gmail.com</li>
            <li><span class="label">Kapcsolattartó telefonszám:</span> [Telefonszám]</li>
          </ul>
        </div>

        <div class="section">
          <h2>2. A szolgáltatás célja</h2>
          <p>
            A Book My Time egy online platform, amely lehetővé teszi vállalkozások számára, hogy időpontokat kezeljenek, és lehetővé teszi az ügyfelek számára, hogy ezen vállalkozásokhoz időpontot foglaljanak.
          </p>
        </div>

        <div class="section">
          <h2>3. Regisztráció és felhasználói fiók</h2>
          <p><strong>Szolgáltatók számára:</strong> Regisztráció után a vállalkozások (pl. fodrászok, autószerelők) saját időpontfoglalási rendszert hozhatnak létre. A szolgáltató köteles biztosítani a megadott adatok helyességét és naprakészségét.</p>
          <p><strong>Ügyfelek számára:</strong> Az ügyfelek regisztrációval vagy vendégként is foglalhatnak időpontot. A foglaláshoz szükséges valós adatok megadása kötelező.</p>
        </div>

        <div class="section">
          <h2>4. Időpontfoglalás</h2>
          <p>Az ügyfelek a rendszer segítségével valós időben választhatnak elérhető időpontokat. Az időpont foglalás sikerességéről e-mailben vagy más értesítési módon kapnak visszaigazolást.</p>
        </div>

        <div class="section">
          <h2>5. Lemondás és módosítás</h2>
          <p>Az időpontok lemondására vagy módosítására az időpont előtt legkésőbb [XX óra/nappal] van lehetőség. A rendszer automatikusan zárolja a módosítás lehetőségét a határidő után.</p>
        </div>

        <div class="section">
          <h2>6. Díjazás és fizetési feltételek</h2>
          <p>Az ügyfelek a foglaláskor előleget vagy teljes összeget fizethetnek online. A fizetés bankkártyával vagy más online módszerrel történik. Lemondás esetén az előleg visszatérítésére a szolgáltató szabályai vonatkoznak.</p>
        </div>

        <div class="section">
          <h2>7. Felelősség kizárása</h2>
          <p>A szolgáltató nem vállal felelősséget adatbeviteli hibákért vagy technikai problémákért. Hibák esetén kérjük, lépjen velünk kapcsolatba: <strong>bookmytime884@gmail.com</strong>.</p>
        </div>

        <div class="section">
          <h2>8. Adatvédelem</h2>
          <p>Az adatokat bizalmasan kezeljük. Harmadik félnek csak jogszabályban előírt esetekben adjuk ki. További információ az Adatvédelmi Szabályzatban.</p>
        </div>

        <div class="section">
          <h2>9. Szerződés megszüntetése</h2>
          <p>Az ügyfelek bármikor megszüntethetik regisztrációjukat. A szolgáltató fenntartja a jogot a fiókok törlésére, ha a felhasználók megszegik az ÁSZF-et.</p>
        </div>

        <div class="section">
          <h2>10. Egyéb rendelkezések</h2>
          <p>A szolgáltató fenntartja a jogot az ÁSZF módosítására. Az ilyen módosításról a felhasználókat legalább 14 nappal előtte értesítjük.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-wrapper {
  max-width: 800px;
  margin: 60px auto;
  padding: 0 20px;
  font-family: "Segoe UI", sans-serif;
  color: #333;
}

.card {
  background: white;
  padding: 32px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

h1 {
  font-size: 24px;
  color: rgba(154, 46, 255, 0.8);;
  text-align: center;
  margin-bottom: 12px;
  font-weight: 600;
}

.effective-date {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 32px;
}

.intro {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

h2 {
  font-size: 18px;
  color: rgba(154, 46, 255, 0.8);;
  margin: 28px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1d5f2;
}

.section {
  margin-bottom: 24px;
}

p {
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 12px;
}

.provider-data {
  list-style: none;
  padding: 0;
  margin: 16px 0;
  background-color: #f9f5ff;
  padding: 16px;
  border-radius: 10px;
}

.provider-data li {
  margin: 8px 0;
  padding-left: 24px;
  position: relative;
  line-height: 1.5;
}

.provider-data li::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 10px;
  width: 6px;
  height: 6px;
  background-color: #a271d2;
  border-radius: 50%;
}

.label {
  font-weight: 600;
  color: rgba(154, 46, 255, 0.8);;
  display: inline-block;
  min-width: 180px;
}

strong {
  color: #6327a2;
}

@media (max-width: 600px) {
  .profile-wrapper {
    margin: 30px auto;
    padding: 0 16px;
  }

  .card {
    padding: 24px;
  }

  h1 {
    font-size: 20px;
  }

  h2 {
    font-size: 17px;
    margin: 24px 0 14px 0;
  }

  .label {
    min-width: 140px;
  }

  .provider-data li {
    padding-left: 20px;
  }
}
</style>