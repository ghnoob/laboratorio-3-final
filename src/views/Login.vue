<template>
  <div class="login">
    <h1>Iniciar sesión</h1>
    <form @submit.prevent="onSubmit">
      <input placeholder="Usuario" v-model.trim="username" required>
      <button type="submit">Iniciar sesión</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
    };
  },

  mounted() {
    sessionStorage.removeItem('username');
    this.$store.commit('setUsername', '');
    this.$store.commit('setTransactions', []);
  },

  methods: {
    onSubmit() {
      this.$store.commit('setUsername', this.username);
      sessionStorage.setItem('username', this.username);
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>
