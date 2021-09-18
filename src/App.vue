<template>
  <div class="content">
    <div v-if="isLoggedIn">
      <header>
        <p class="username">{{ username }}</p>
      </header>
      <nav id="nav">
        <router-link class="link" :to="{ name: 'Home' }">Home</router-link> |
        <router-link class="link" :to="{ name: 'Transactions' }">Transacciones</router-link> |
        <router-link class="link" :to="{ name: 'Wallet' }">Cartera</router-link> |
        <router-link class="link" :to="{ name: 'Results' }">Resultados</router-link> |
        <router-link class="link" :to="{ name: 'Login' }">Cerrar sesión</router-link>
      </nav>
    </div>
    <nav id="nav" v-else-if="$route.name !== 'Login'">
      <router-link class="link" :to="{ name: 'Login' }">Iniciar sesión</router-link>
    </nav>
    <router-view/>
  </div>
  <footer>
    <p>Laboratorio de Computación III - Rodrigo Pietnechuk - Trabajo Final</p>
  </footer>
</template>

<script>
import exchangeServices from './services/exchangeServices';
import apiServices from './services/apiServices';

export default {
  mounted() {
    this.loadPrices();
    const username = sessionStorage.getItem('username');
    if (username) {
      this.$store.commit('setUsername', username);
      this.pullTransactions();
    }
  },
  methods: {
    async loadPrices() {
      try {
        this.$toast.show('Cargando precios...', { duration: false });
        const prices = await exchangeServices.getPrices();
        this.$store.commit('setPrices', prices);
        this.$toast.clear();
        this.$toast.success('Precios cargados');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
      }
    },
    async pullTransactions() {
      try {
        this.$toast.show('Cargando...', { duration: false });
        const response = await apiServices.getTransactions(this.username);
        this.$store.commit('setTransactions', response.data);
        this.$toast.clear();
        this.$toast.success('Datos cargados');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
      }
    },
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
    transactions() {
      return this.$store.state.transactions;
    },
    isLoggedIn() {
      return Boolean(this.username);
    },
  },
  watch: {
    username(value) {
      if (value) {
        this.pullTransactions();
      }
    },
  },
};
</script>
