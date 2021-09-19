<template>
  <div class="container-sm">
    <h1 class="text-center">Iniciar sesión</h1>
    <form @submit.prevent="onSubmit">
      <div class="input-group">
        <span class="input-group-text">@</span>
        <input
          type="text"
          class="form-control"
          placeholder="Usuario"
          aria-label="Usuario"
          v-model.trim="username"
          required
        >
        <button class="btn btn-primary" type="submit">Iniciar sesión</button>
      </div>
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
