<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-brand">
          <router-link to="/" class="footer-logo">
            bookyourtime<span class="logo-dot">.</span>
          </router-link>
          <p class="footer-tagline">Egyszerű időpontfoglalás, profi szolgáltatások</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h3 class="link-title">Navigáció</h3>
            <router-link to="/" class="footer-link">Kezdőlap</router-link>
            <router-link to="/foglalas" class="footer-link">Foglalás</router-link>
            <router-link to="/vallalkozok" class="footer-link">Vállalkozók</router-link>
          </div>

          <div class="link-group">
            <h3 class="link-title">Információ</h3>
            <router-link to="/rolunk" class="footer-link">Rólunk</router-link>
            <router-link to="/kapcsolat" class="footer-link">Kapcsolat</router-link>
            <router-link to="/gyik" class="footer-link">GYIK</router-link>
          </div>

          <div class="link-group">
            <h3 class="link-title">Jogi</h3>
            <router-link to="/adatvedelem" class="footer-link">Adatvédelem</router-link>
            <router-link to="/felhasznalasi-feltetelek" class="footer-link">Felhasználási feltételek</router-link>
            <router-link to="/cookie-szabalyzat" class="footer-link">Cookie szabályzat</router-link>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">&copy; 2024 bookyourtime. Minden jog fenntartva.</p>
        <div class="legal-links">
          <router-link to="/adatvedelem" class="legal-link">Adatvédelem</router-link>
          <span class="divider">|</span>
          <router-link to="/felhasznalasi-feltetelek" class="legal-link">Felhasználási feltételek</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
:root {
  --primary-color: #6B00D0;
  --primary-light: #9A32CD;
  --text-dark: #2D3748;
  --text-light: #718096;
  --bg-white: #FFFFFF;
  --bg-light: #F8F9FA;
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.footer {
  background-color:black;
  color: white;
  padding: 4rem 0 0;
  position: relative;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  margin-bottom: 1rem;
  transition: var(--transition);
}

.logo-dot {
  color: var(--primary-color);
}

.footer-logo:hover {
  color: var(--primary-light);
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: var(--transition);
}

.social-link:hover {
  background-color: var(--primary-color);
  transform: translateY(-3px);
}

.social-link svg {
  width: 20px;
  height: 20px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.link-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.link-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.link-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: var(--primary-color);
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: var(--transition);
  position: relative;
}

.footer-link:hover {
  color: white;
  padding-left: 8px;
}

.footer-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: var(--transition);
}

.footer-link:hover::before {
  width: 5px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  text-align: center;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.legal-link {
  color: black;
  font-size: 0.9rem;
  text-decoration: none;
  transition: var(--transition);
}

.legal-link:hover {
  color: var(--primary-light);
}

.divider {
  color: rgba(255, 255, 255, 0.3);
}

/* Responsive styles */
@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .legal-links {
    flex-direction: column;
    gap: 0.5rem;
  }

  .divider {
    display: none;
  }
}
</style>