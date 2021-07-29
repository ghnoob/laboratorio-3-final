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
import apiServices from '@/services/apiServices';

export default {
  data() {
    return {
      username: '',
    };
  },

  created() {
    this.$store.commit('setUsername', '');
    this.$store.commit('setTransactions', []);
  },

  methods: {
    async pullTransactions() {
      this.$toast.show('Cargando...');
      try {
        const response = await apiServices.getTransactions(this.username);
        this.$store.commit('setTransactions', response.data);
        this.$toast.clear();
      } catch {
        this.$toast.clear();
        this.$toast.error('Error', { duration: 2000 });
      }
    },
    onSubmit() {
      this.$store.commit('setUsername', this.username);
      this.pullTransactions();
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  height: 100%;
}

.login form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: max-content;
}

input {
  height: auto;
}
</style>
