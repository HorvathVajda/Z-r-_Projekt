<template>
  <div class="register-container">
    <div class="floating-dots">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
    </div>
    <div class="register-content">
      <div class="register-card">
        <div class="register-header">
          <h2>Üdvözöljük!</h2>
          <p>Válassza ki a regisztráció típusát</p>
        </div>
        
        <div class="register-options">
          <button class="register-button" @click="redirectToBusinessRegistration">
            <div class="button-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Vállalkozóként regisztrálok</span>
            </div>
          </button>
          
          <button class="register-button" @click="redirectToClientRegistration">
            <div class="button-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Ügyfélként regisztrálok</span>
            </div>
          </button>
        </div>
        
        <div class="register-footer">
          <p>Már van fiókja? <router-link to="/login" class="login-link">Bejelentkezés</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function redirectToBusinessRegistration() {
  router.push('/vallalkozoRegister');
}

function redirectToClientRegistration() {
  router.push('/register');
}
</script>

<style scoped>
.register-container {
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

.register-content {
  width: 100%;
  max-width: 600px;
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

.register-card {
  width: 100%;
  max-width: 450px;
}

.register-header {
  margin-bottom: 3rem;
  text-align: center;
}

.register-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #718096;
  font-size: 1rem;
}

.register-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.register-button {
  width: 100%;
  padding: 1.25rem;
  background-color: white;
  color: black;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.register-button svg{
  transition: transform 0.2s;
}

.register-button:hover svg {
  transform: translateX(3px);
}

.register-button:hover {
  border-color: black;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.button-content svg {
  color: #6B00D0;
}

.register-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: #718096;
}

.login-link {
  color: black;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-content {
    max-width: 100%;
    padding: 2rem 1.5rem;
    margin: 0;
  }
  
  .dot {
    display: none;
  }
  
  .register-content {
    background-color: #ffffff;
  }
  
  .register-header h2 {
    font-size: 1.75rem;
  }
  
  .register-button {
    padding: 1rem;
  font-size: 0.9375rem;
  border-radius: 0.5rem;
  }
}
</style>