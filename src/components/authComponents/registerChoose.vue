<template>
  <div class="valaszt">
    <button @click="redirectToBusinessRegistration">Vállalkozóként regisztrálok</button>
    <button @click="redirectToClientRegistration">Ügyfélként regisztrálok</button>
  </div>

</template>

<script>
export default{
  name: 'registerChoose',
  data() {
  return {
    role: ''
  };
},
methods: {
  redirectToBusinessRegistration() {
    this.$router.push('/vallalkozoRegister');
  },
  redirectToClientRegistration() {
    this.$router.push('/register');
  }
}


}
</script>

<style scoped>
.valaszt{
  padding-top: 20px;
}
</style>
