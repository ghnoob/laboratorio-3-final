<template>
  <div class="home">
    <h1>Inicio</h1>
    <h2 class="text-center">Precios actuales</h2>
    <div class="container">
      <currency-widget
        class="mb-2"
        v-for="crypto in cryptoCodes"
        :key="crypto.code"
        :currencyId="crypto.id"
      >
      </currency-widget>
    </div>
  </div>
</template>

<script>
import CurrencyWidget from '../components/CurrencyWidget.vue';

export default {
  components: { CurrencyWidget },
  computed: {
    cryptoCodes() {
      return this.$store.state.cryptoCodes;
    },
  },
};
</script>
