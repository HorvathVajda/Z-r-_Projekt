<template>
  <div class="contact-container">
    <div class="floating-dots">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
    </div>
    <div class="contact-content">
      <div class="contact-card">
        <div class="contact-header">
          <h2>Kapcsolatfelvétel</h2>
          <p>Lépj kapcsolatba velünk az alábbi űrlap segítségével!</p>
        </div>
        
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="name">Név</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              placeholder="Add meg a neved"
              required
              class="form-input"
            />
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
          </div>
          
          <div class="form-group">
            <label for="email">Email cím</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              placeholder="pelda.email@gmail.com"
              required
              class="form-input"
            />
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
          </div>
          
          <div class="form-group">
            <label for="message">Üzenet</label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="5"
              placeholder="Írd meg az üzeneted..."
              required
              class="form-input"
            ></textarea>
            <span class="input-icon textarea-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
          </div>
          
          <button type="submit" class="contact-button" @click="sendEmail">
            <span>Üzenet küldése</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
          
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import emailjs from 'emailjs-com';

const formData = ref({
  name: "",
  email: "",
  message: "",
});

const errorMessage = ref("");
const successMessage = ref("");

function submitForm() {
  sendEmail();
}

function sendEmail() {
  const templateParams = {
    from_name: formData.value.name,
    user_email: formData.value.email,
    message: formData.value.message,
  };

  emailjs.send('service_et6yxeo', 'template_d7tlhxi', templateParams, 'An_2K3rlynQaF-gOD')
    .then((response) => {
      successMessage.value = "Az üzenet sikeresen elküldve!";
      errorMessage.value = "";
      formData.value = { name: "", email: "", message: "" };
      console.log('Success!', response.status, response.text);
    }, (err) => {
      errorMessage.value = "Hiba történt az üzenet küldése közben.";
      successMessage.value = "";
      console.error('Failed...', err);
    });
}
</script>

<style scoped>
.contact-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;
  background-color: #fafafa;
}

.floating-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dot {
  position: absolute;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.5;
}

.dot-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #c7aaff 0%, rgba(255,182,193,0) 70%);
  top: 10%;
  left: 15%;
  animation: float 45s ease-in-out infinite;
}

.dot-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #c7aaff 0%, rgba(255,105,180,0) 70%);
  bottom: 15%;
  right: 10%;
  animation: float 60s ease-in-out infinite reverse;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(50px, 30px) rotate(5deg);
  }
  50% {
    transform: translate(0, 50px) rotate(0deg);
  }
  75% {
    transform: translate(-30px, 20px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.contact-content {
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  z-index: 1;
  margin-left: auto;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.03);
}

.contact-card {
  width: 100%;
  max-width: 500px;
}

.contact-header {
  margin-bottom: 2rem;
  text-align: center;
}

.contact-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
}

.contact-header p {
  color: #718096;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.25rem;
  position: relative;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: #f8fafc;
}

textarea.form-input {
  min-height: 120px;
  resize: vertical;
}

.form-input:focus {
  outline: none;
  border-color: rgba(107, 0, 208, 0.2);
  box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.1);
  background-color: #ffffff;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 2.5rem;
  color: #a0aec0;
}

.textarea-icon {
  top: 2.8rem;
}

.contact-button {
  width: 100%;
  padding: 0.75rem;
  background-color: black;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.contact-button:hover {
  background-color: black;
}

.contact-button svg {
  transition: transform 0.2s;
}

.contact-button:hover svg {
  transform: translateX(3px);
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
}

.success-message {
  color: #38a169;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .contact-content {
    max-width: 100%;
    padding: 2rem 1.5rem;
    margin: 0;
  }
  
  .dot {
    display: none;
  }
  
  .contact-content {
    background-color: #ffffff;
  }
}
</style>