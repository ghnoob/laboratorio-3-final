<template>
  <h1>Billetera</h1>
  <div v-if="availableCryptos.length > 0">
    <table class="green-table">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Dinero</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(crypto, i) in availableCryptos" :key="i">
          <td>{{ getCryptoName(crypto) }}</td>
          <td>{{ wallet[crypto] }}</td>
          <td>Placeholder</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td>Total</td>
          <td>Placeholder</td>
        </tr>
      </tfoot>
    </table>
  </div>
  <p v-else>La cartera está vacía.</p>
</template>

<script>
export default {
  methods: {
    getCryptoName(code) {
      return this.cryptoList.find((item) => item.code === code).name;
    },
  },
  computed: {
    wallet() {
      return this.$store.getters.wallet;
    },
    availableCryptos() {
      return Object.keys(this.wallet).filter((item) => this.wallet[item] > 0);
    },
    cryptoList() {
      return this.$store.state.cryptoCodes;
    },
  },
};
</script>
