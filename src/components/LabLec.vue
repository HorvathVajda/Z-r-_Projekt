<template>
  <footer class="footer">
    <div class="footer-container">
      <a class="nav-link" href="/kapcsolat">Kapcsolatfelvétel</a>
      <a class="nav-link" href="/rolunk">Rólunk</a>
      <a class="nav-link" href="/adatvedelem">Adatvédelem</a>
    </div>
    <p>&copy; 2024 BookMyTime. Minden jog fenntartva.</p>
  </footer>
</template>

<script>
export default {
  name: "LabLec",
};
</script>

<style scoped>
.footer {
  width: 100%;
  background-color: #f4f4f4;
  color: #333; /* Darker color for better contrast */
  padding: 10px;
  text-align: center;
  position: relative;
  bottom: 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* Light shadow to separate from content */
}

.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.nav-link {
  color: #6B00D0; /* Consistent brand color */
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease, transform 0.2s ease;
  padding: 5px 10px;
}

.nav-link:hover {
  transform: translateY(-2px); /* Subtle lifting effect */
}

p {
  margin-top: 15px;
  font-size: 14px;
  color: #777; /* Lighter gray for the copyright text */
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
