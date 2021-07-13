<template>
  <div class="login">
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

  created() {
    this.$store.commit('setUsername', '');
  },

  methods: {
    onSubmit() {
      this.$store.commit('setUsername', this.username);
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
  height: 100%;
}

.login form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: max-content;
}

input {
  height: 100%;
}
</style>
