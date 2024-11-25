<template>
      <div>
      <h1>API válasz:</h1>
      <p>{{ apiMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      message: '',
    };
  },
  mounted() {
    // API kérés
    axios.get('http://localhost:5000/api')
      .then(response => {
        this.message = response.data.message;
      })
      .catch(error => {
        console.error('Hiba az API hívás során:', error);
      });
  },
};
</script>

<style scoped>

</style>
