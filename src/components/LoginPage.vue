<template>
  <div class="login-container">
    <div class="floating-dots">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
    </div>
    <div class="login-content">
      <div class="login-card">
        <div class="login-header">
          <h2>
            Üdvözöljük!</h2>
          <p>Kérjük, adja meg hitelesítő adatait a bejelentkezéshez</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email cím</label>
            <input
              type="email"
              id="email"
              v-model="email"
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
            <label for="password">Jelszó</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="••••••••"
              required
              class="form-input"
            />
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
          </div>
          
          <button type="submit" class="login-button">
            <span>Bejelentkezés</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          
          <div class="login-footer">
            <p>Nincs fiókja? <router-link to="/registerChoose" class="register-link">Regisztráció</router-link></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      jelszo: password.value,
    });

    const { token, expirationTime, tipus, id } = response.data;

    const authData = {
      token,
      email: email.value,
      expirationTime,
      tipus,
      id,
    };

    localStorage.setItem('authData', JSON.stringify(authData));
    router.replace("/").then(() => {
      location.reload();
    });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "An error occurred during login.";
  }
}

// Optional: Add mouse parallax effect to dots
onMounted(() => {
  const container = document.querySelector('.login-container');
  const dot1 = document.querySelector('.dot-1');
  const dot2 = document.querySelector('.dot-2');
  
  if (container && dot1 && dot2) {
    container.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      dot1.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`;
      dot2.style.transform = `translate(${-x * 20 + 10}px, ${-y * 20 + 10}px)`;
    });
  }
});
</script>

<style scoped>
.login-container {
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

.login-content {
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

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-header {
  margin-bottom: 2rem;
  text-align: center;
}

.login-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
}

.login-header p {
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

.login-button {
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

.login-button:hover {
  background-color: black;
}

.login-button svg {
  transition: transform 0.2s;
}

.login-button:hover svg {
  transform: translateX(3px);
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
}

.login-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #718096;
}

.register-link {
  color: black;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-content {
    max-width: 100%;
    padding: 2rem 1.5rem;
    margin: 0;
  }
  
  .dot {
    display: none;
  }
  
  .login-content {
    background-color: #ffffff;
  }
}
</style>