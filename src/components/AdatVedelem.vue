<template>
  <div class="adatvedelem">
    <h1>Adatvédelmi nyilatkozat</h1>

    <div v-for="(section, index) in sections" :key="index" class="section">
      <h2 @click="toggleSection(index)" :class="{'active': isActive(index)}">{{ section.title }}</h2>
      <p v-if="isActive(index)" v-html="section.content"></p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sections: [
        {
          title: "Az adatkezelő adatai",
          content: "Adatkezelő neve: [Cégnév/üzemeltető neve], Elérhetőség: [E-mail cím, telefonszám, postacím], Adatvédelmi tisztviselő: [Név, elérhetőség] (ha van)",
          active: false
        },
        {
          title: "Gyűjtött adatok",
          content: "A weboldal használata során az alábbi adatokat gyűjthetjük: Személyes adatok: Név, e-mail cím, telefonszám, foglalási információk. Technikai adatok: IP-cím, böngésző típusa, operációs rendszer, látogatási statisztikák. A személyes adatokat az alábbi célokra használjuk: Időpontfoglalások feldolgozása és visszaigazolása, Kapcsolattartás és ügyfélszolgálat, A szolgáltatásaink fejlesztése és testreszabása, Jogszabályi kötelezettségek teljesítése.",
          active: false
        },
        {
          title: "Az adatok megosztása",
          content: "Az Ön adatait harmadik féllel kizárólag az alábbi esetekben osztjuk meg: A foglaláshoz szükséges partnerekkel (pl. szolgáltatók), Jogszabályi előírás alapján (pl. hatósági megkeresés esetén).",
          active: false
        },
        {
          title: "Adatok tárolása",
          content: "Az adatokat biztonságos szervereken tároljuk, és csak addig őrizzük meg, amíg szükséges a fent megjelölt célok teljesítéséhez, vagy amíg a jogszabályok előírják.",
          active: false
        },
        {
          title: "Cookie-k és hasonló technológiák",
          content: "A weboldalunk cookie-kat használ a felhasználói élmény javítása és a weboldal működésének biztosítása érdekében. További információ a Cookie Szabályzatunkban.",
          active: false
        },
        {
          title: "Adatbiztonság",
          content: "Megfelelő technikai és szervezeti intézkedéseket alkalmazunk az adatok védelme érdekében, például titkosítást és hozzáférés-kezelést.",
          active: false
        },
        {
          title: "Módosítások",
          content: "Az adatvédelmi nyilatkozatot időről időre frissíthetjük. Az aktuális verzió mindig elérhető ezen az oldalon. Kérjük, rendszeresen tekintse át a változásokat.",
          active: false
        },
        {
          title: "Kapcsolatfelvétel",
          content: `Ha bármilyen kérdése vagy panasza van az adatkezeléssel kapcsolatban, kérjük, vegye fel velünk a kapcsolatot! <br><a href='/kapcsolat' class="kapcsolat-link">Kapcsolatfelvétel</a>`,
          active: false
        }
      ]
    };
  },
  methods: {
    toggleSection(index) {
      // Ha a szakasz már nyitva van, akkor azt bezárjuk, különben megnyitjuk
      if (this.isActive(index)) {
        this.sections[index].active = false;
      } else {
        // Minden szakaszt bezárunk, majd az aktuális szakaszt nyitjuk meg
        this.sections.forEach((section) => section.active = false);
        this.sections[index].active = true;
      }
    },
    isActive(index) {
      return this.sections[index].active;
    }
  }
};
</script>

<style scoped>

.kapcsolat-link {
  color: #0056b3;
  text-decoration: none;
}

.kapcsolat-link:hover {
  text-decoration: underline;
}
.adatvedelem{
  padding-top: 15px;
  width: 800px;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  cursor: pointer;
  padding: 1rem;
  background-color: #f4f4f4;
  border-radius: 5px;
  margin: 1rem 0;
  transition: color 0.3s ease;
}

.section h2:hover {
  color: goldenrod;
}

.section p {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.active {
  color: goldenrod;
}
</style>
