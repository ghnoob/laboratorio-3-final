<template>
  <h1>Resultados</h1>
  <table class="green-table" v-if="transactions.length > 0">
    <thead>
      <tr>
        <th>Criptomoneda</th>
        <th>Resultado</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="crypto in filteredCryptoList" :key="crypto.code">
        <td>{{ crypto.name }}</td>
        <td>Placeholder</td>
      </tr>
    </tbody>
    <tfoot>
      <td>Total</td>
      <td>placeholder</td>
    </tfoot>
  </table>
  <p v-else>No se han registrado transacciones hasta el momento.</p>
</template>

<script>
export default {
  computed: {
    transactions() {
      return this.$store.state.transactions;
    },
    filteredCryptoList() {
      const codes = this.$store.state.cryptoCodes;
      const predicate = (code) => this.transactions.some((t) => t.crypto_code === code);
      return codes.filter((item) => predicate(item.code));
    },
  },
};
</script>
