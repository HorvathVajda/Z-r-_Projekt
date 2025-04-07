<template>
  <div class="register-container">
    <div class="floating-dots">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
    </div>
    <div class="register-content">
      <div class="register-card">
        <div class="register-header">
          <h2>Vállakozói Regisztráció</h2>
          <p>Kérjük, töltse ki az alábbi mezőket</p>
        </div>
        
        <form @submit.prevent="handleRegistration" class="register-form">
          <div class="form-grid">
            <!-- Row 1 -->
            <div class="form-group">
              <label for="name">Teljes név</label>
              <div class="input-wrapper">
                <input
                  id="name"
                  v-model="name"
                  required
                  placeholder="Teljes név"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">E-mail cím</label>
              <div class="input-wrapper">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="E-mail cím"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
              </div>
            </div>
            
            <!-- Row 2 -->
            <div class="form-group">
              <label for="password">Jelszó</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  placeholder="Jelszó"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
              </div>
              <div v-if="password && passwordStrength !== 'strong'" class="password-strength">
                <p v-if="password.length < 8"><span class="icon">✗</span> 8+ karakter</p>
                <p v-if="!/[a-z]/.test(password)"><span class="icon">✗</span> kisbetű</p>
                <p v-if="!/[A-Z]/.test(password)"><span class="icon">✗</span> nagybetű</p>
                <p v-if="!/[0-9]/.test(password)"><span class="icon">✗</span> szám</p>
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Jelszó megerősítése</label>
              <div class="input-wrapper">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  required
                  placeholder="Jelszó megerősítése"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
              </div>
              <p v-if="confirmPassword && confirmPassword !== password" class="error-message">
                A jelszavak nem egyeznek
              </p>
            </div>
            
            <!-- Row 3 -->
            <div class="form-group">
              <label for="phone">Telefonszám</label>
              <div class="input-wrapper">
                <input
                  id="phone"
                  v-model="phone"
                  type="tel"
                  required
                  placeholder="Telefonszám"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
              </div>
              <p v-if="phone && !phone.match(/^\+?(\d{1,3})?(\d{8})$/)" class="error-message">
                Érvényes szám szükséges
              </p>
            </div>
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="terms" v-model="termsAccepted" />
              <label for="terms">
                Elfogadom az <a href="/Adatvedelem" target="_blank" class="terms-link">ÁSZF-et</a>
              </label>
            </div>
          </div>

          <button type="submit" class="register-button" :disabled="!isFormValid || !termsAccepted">
            Regisztráció
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
          <div class="login-link">
            Már van fiókja? <router-link to="/login">Bejelentkezés</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      termsAccepted: false,
      formSubmitted: false,
    };
  },
  computed: {
    passwordStrength() {
      const password = this.password;
      if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        return 'strong';
      }
      return 'weak';
    },
    isFormValid() {
      return (
        this.name &&
        this.email &&
        this.password === this.confirmPassword &&
        this.passwordStrength === 'strong' &&
        this.phone.match(/^\+?(\d{1,3})?(\d{8})$/)
      );
    },
  },
  methods: {
    handleRegistration() {
      this.formSubmitted = true;
      if (!this.isFormValid || !this.termsAccepted) {
        alert('Kérjük, töltse ki helyesen az összes mezőt és fogadja el az ÁSZF-et!');
        return;
      }

      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone,
        tipus: 'felhasznalo',
      };

      axios.post('http://localhost:5000/api/auth/register-vallalkozo', userData)
        .then((response) => {
          console.log('Regisztráció sikeres:', response.data);
          alert(response.data.message);
          this.$router.push('/login');
        })
        .catch((error) => {
          console.error('Regisztráció hiba:', error.response?.data || error.message);
          alert(error.response?.data?.error || 'Hiba történt a regisztráció során.');
        });
    },
  },
};
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
  max-width: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  z-index: 1;
  margin-left: auto;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.03);
}

.register-card {
  width: 100%;
  max-width: 700px;
  padding: 1.5rem;
}

.register-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.register-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #718096;
  font-size: 0.95rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 0.5rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  color: #4a5568;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.form-group input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  transition: all 0.2s;
  background-color: #f8fafc;
  height: 40px;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(107, 0, 208, 0.2);
  box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.1);
  background-color: #ffffff;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 0.9rem;
}

.password-strength {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
  margin-top: 0.3rem;
  font-size: 0.7rem;
  color: #4a5568;
}

.password-strength p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.password-strength .icon {
  color: #e53e3e;
  font-size: 0.8rem;
}

.error-message {
  color: #e53e3e;
  font-size: 0.7rem;
  margin-top: 0.2rem;
}

.checkbox-group {
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.checkbox-group input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: black;
}

.checkbox-group label {
  font-size: 0.8rem;
  color: #4a5568;
  margin: 0;
}

.terms-link {
  color: black;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-button {
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

.login-link {
  grid-column: span 2;
  text-align: center;
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.5rem;
}

.login-link a {
  color: black;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-content {
    max-width: 100%;
    padding: 1rem;
    margin: 0;
  }
  
  .dot {
    display: none;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .checkbox-group,
  .register-button,
  .login-link {
    grid-column: span 1;
  }
  
  .register-card {
    padding: 1rem;
  }
  
  .register-header h2 {
    font-size: 1.5rem;
  }
}
</style>