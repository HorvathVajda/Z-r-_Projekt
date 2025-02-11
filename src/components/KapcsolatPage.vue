<template>
  <div class="contact-container">
    <header>
      <h1>Kapcsolatfelvétel</h1>
      <p>Lépj kapcsolatba velünk az alábbi űrlap segítségével!</p>
    </header>
    <main>
      <form @submit.prevent="submitForm" class="contact-form">
        <label for="name">Név</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          placeholder="Add meg a neved"
          required
        />

        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          placeholder="Add meg az email címed"
          required
        />

        <label for="message">Üzenet</label>
        <textarea
          id="message"
          v-model="formData.message"
          rows="5"
          placeholder="Írd meg az üzeneted..."
          required
        ></textarea>

        <button type="submit">Küldés</button>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  name: "KapcsolatPage",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });

        // Ha a válasz nem sikeres, dobunk egy hibát
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API válasz:", errorData); // Kiírja a válasz adatokat
          throw new Error(errorData.error || "Hiba történt az üzenet küldésekor!");
        }

        // Sikeres válasz esetén üzenet küldése és form ürítése
        alert("Üzeneted sikeresen elküldtük!");
        this.formData = { name: "", email: "", message: "" }; // Alapállapot
      } catch (error) {
        console.error("Hiba:", error.message); // Hibaüzenet kiírása a konzolra
        alert("Nem sikerült elküldeni az üzenetet: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Általános stílusok */
.contact-container {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: black;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

header {
  text-align: center;
  padding: 20px;
  color:black;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
}

/* Fix szélességű form */
.contact-form {
  border: 3px solid black;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 600px; /* Fix szélesség */
  max-width: 100%; /* Ne lépje túl a képernyőt mobilon */
}

/* Form elemek */
.contact-form label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  border: 2px solid black; /* Fekete szegély */
  border-radius: 0.5em;
}

.contact-form button {
  background: gold;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.contact-form button:hover {
  background: goldenrod;
}

/* Reszponzív módosítások (mobil nézet) */
@media (max-width: 600px) {
  header h1 {
    font-size: 1.5em;
  }

  .contact-form {
    padding: 15px;
  }
}
</style>
