<template>
  <div class="contact-container">
    <!-- Bal oldali háttérkép -->
    <div class="left-side"></div>

    <!-- Jobb oldali űrlap -->
    <div class="right-side">
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

          <button type="submit" @click="sendEmail">Küldés</button>

          <!-- Hibaüzenetek megjelenítése -->
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>
        </form>
      </main>
    </div>
  </div>
</template>

<script>
import emailjs from 'emailjs-com';

export default {
  name: "KapcsolatPage",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        message: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    submitForm() {
      this.sendEmail();
    },
    sendEmail() {
      const templateParams = {
        from_name: this.formData.name,  // felhasználó neve
        user_email: this.formData.email, // felhasználó email címe
        message: this.formData.message,  // üzenet
      };

      emailjs.send('service_et6yxeo', 'template_d7tlhxi', templateParams, 'An_2K3rlynQaF-gOD')
        .then((response) => {
          this.successMessage = "Az Email sikeresen elküldve!";
          this.errorMessage = "";
          console.log('Success!', response.status, response.text);
        }, (err) => {
          this.errorMessage = "Failed to send message.";
          this.successMessage = "";
          console.error('Failed...', err);
        });
    }
  },
};
</script>

<style scoped>
.contact-container {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  min-height: 100vh;
}

.contact-container .left-side {
  flex: 1;
  background-image: url('/ff.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.contact-container .right-side {
  flex: 1;
  display: flex;
  flex-direction: column; /* Vertikális elrendezés */
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

header {
  text-align: center;
  color: #6327A2;
  margin-bottom: 20px;
}

.contact-form {
  margin-top: 20px;
  border: 3px solid transparent;
  padding: 30px;
  width: 600px;
  max-width: 100%;
  box-sizing: border-box;
}

/* Form elemek */
.contact-form label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: #333;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #ccc;
  border-radius: 0.5em;
  transition: border-color 0.3s;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: #6327A2;
  outline: none;
}

.contact-form button {
  background: #6327A2;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
  margin-top: 20px; /* Optional: Adds some space above the button */
  align-items: center; /* Centers all children elements (including button) */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;


}

.contact-form button:hover {
  color: #6327A2;
  background: transparent;
}

/* Hibaüzenet */
.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

/* Sikeres üzenet */
.success {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}

/* Reszponzív módosítások */
@media (max-width: 600px) {
  .contact-container {
    flex-direction: column;
  }

  header h1 {
    font-size: 1.5em;
  }

  .contact-form {
    padding: 20px;
  }
}
</style>
