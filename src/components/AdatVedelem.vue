<template>
  <section class="adatvedelem">
    <h1>Általános Szerződési Feltételek (ÁSZF)</h1>
    <h2 id="hatalyos">Hatályos: 2024. Szeptember 01.</h2>

    <p>Jelen Általános Szerződési Feltételek (ÁSZF) a [Projekt neve] által nyújtott online időpontfoglaló rendszer igénybevételének feltételeit tartalmazza. A rendszer használatával Ön elfogadja az alábbi feltételeket.</p>

    <h2>1. Szolgáltató adatai</h2>
    <p>Szolgáltató neve: [Cégnév vagy magánszemély neve]</p>
    <p>Székhely: [Cím]</p>
    <p>Adószám: [Ha van]</p>
    <p>Kapcsolattartó e-mail cím: [E-mail cím]</p>
    <p>Kapcsolattartó telefonszám: [Telefonszám]</p>

    <h2>2. A szolgáltatás célja</h2>
    <p>A [Projekt neve] egy online platform, amely lehetővé teszi vállalkozások számára, hogy időpontokat kezeljenek, és lehetővé teszi az ügyfelek számára, hogy ezen vállalkozásokhoz időpontot foglaljanak.</p>

    <h2>3. Regisztráció és felhasználói fiók</h2>
    <p><strong>Szolgáltatók számára:</strong> Regisztráció után a vállalkozások (pl. fodrászok, autószerelők) saját időpontfoglalási rendszert hozhatnak létre. A szolgáltató köteles biztosítani a megadott adatok helyességét és naprakészségét.</p>
    <p><strong>Ügyfelek számára:</strong> Az ügyfelek regisztrációval vagy vendégként is foglalhatnak időpontot. A foglaláshoz szükséges valós adatok megadása kötelező.</p>

    <h2>4. Időpontfoglalás</h2>
    <p>Az ügyfelek a rendszer segítségével valós időben választhatnak elérhető időpontokat. Az időpont foglalás sikerességéről e-mailben vagy más értesítési módon kapnak visszaigazolást. A rendszerben található foglalási naptár az adott szolgáltató által megadott időintervallumok alapján működik.</p>

    <h2>5. Lemondás és módosítás</h2>
    <p>Az időpontok lemondására vagy módosítására az időpont előtt legkésőbb [XX óra/nappal] van lehetőség. A lemondási határidő lejárta után a rendszer automatikusan zárolja az időpont módosítását. A szolgáltató fenntartja a jogot, hogy időpontokat töröljön, például vis maior helyzetekben, erről az ügyfeleket haladéktalanul értesíti.</p>

    <h2>6. Díjazás és fizetési feltételek</h2>
    <p>Az ügyfelek a foglaláskor előleget vagy teljes összeget fizethetnek online, ha a szolgáltató ezt megköveteli. A fizetés bankkártyával vagy más online fizetési módszerrel történik. Lemondás esetén az előleg visszatérítésére a szolgáltató saját szabályai vonatkoznak.</p>

    <h2>7. Felelősség kizárása</h2>
    <p>A szolgáltató nem vállal felelősséget a foglalások során bekövetkező adatbeviteli hibákért vagy harmadik felek okozta technikai problémákért. A rendszer használata során fellépő hibák esetén kérjük, vegye fel velünk a kapcsolatot a [e-mail cím] címen.</p>

    <h2>8. Adatvédelem</h2>
    <p>Az időpontfoglaló rendszer használata során megadott adatokat a Szolgáltató bizalmasan kezeli, harmadik fél számára nem adja ki, kivéve jogszabályban előírt esetekben. Az adatkezeléssel kapcsolatos részletek az Adatvédelmi Szabályzatban találhatók.</p>

    <h2>9. Szerződés megszüntetése</h2>
    <p>Az ügyfelek bármikor megszüntethetik regisztrációjukat. A szolgáltató fenntartja a jogot a felhasználói fiókok törlésére, ha a felhasználók megszegik az ÁSZF-et.</p>

    <h2>10. Egyéb rendelkezések</h2>
    <p>A szolgáltató fenntartja a jogot az ÁSZF egyoldalú módosítására, amelyről a felhasználókat legalább [XX nappal] előzetesen értesíti. Az ÁSZF-ben nem szabályozott kérdésekre a magyar jog az irányadó.</p>
  </section>
</template>

<script>
</script>

<style scoped>
.adatvedelem {
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  color: #333;
  border-radius: 10px;
  margin: auto;
  max-width: 800px;
}

h1 {
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #b8860b;
}

#hatalyos {
  text-align: center;
  font-size: 1.1em;
  margin-bottom: 20px;
  color: #888;
}

h2 {
  font-size: 1.5em;
  margin-top: 20px;
  color: #b8860b;
  border-bottom: 2px solid #b8860b;
  padding-bottom: 5px;
}

p {
  font-size: 1.1em;
  line-height: 1.6;
  text-align: justify;
  margin-bottom: 15px;
  color: #333;
}

strong {
  font-weight: bold;
}

@media (max-width: 768px) {
  .adatvedelem {
    padding: 20px;
    margin: 10px;
  }

  h1 {
    font-size: 1.5em;
  }

  h2 {
    font-size: 1.3em;
  }

  p {
    font-size: 1em;
  }
}
</style>
