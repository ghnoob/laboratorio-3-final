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
      <tr v-for="crypto in tableData" :key="crypto.code">
        <td>{{ crypto.name }}</td>
        <td :class="{ red: crypto.result < 0 }">${{ crypto.result.toFixed(2) }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td :class="{ red: totalResults < 0 }">${{ totalResults.toFixed(2) }}</td>
      </tr>
    </tfoot>
  </table>
  <p v-else>No se han registrado transacciones hasta el momento.</p>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.fillTableData();
    this.setResults();
  },
  methods: {
    fillTableData() {
      this.tableData = this.filteredCryptoList.map((item) => ({
        code: item.code,
        name: item.name,
        result: 0, // seteado despues
      }));
    },
    setResults() {
      this.tableData.forEach(async (item) => {
        const operations = this.transactions.filter((t) => t.crypto_code === item.code);

        let income = 0;
        let spendings = 0;
        let currentValue = 0;

        operations.forEach((op) => {
          if (op.action === 'sale') income += parseFloat(op.money);
          else spendings += parseFloat(op.money);
        });

        const amountInWallet = this.$store.getters.wallet[item.code];
        if (amountInWallet > 0) {
          const response = await axios.get(`https://criptoya.com/api/satoshitango/${item.code}/ars`);
          currentValue = response.data.totalBid * amountInWallet;
        }

        item.result = currentValue - spendings + income;
      });
    },
  },
  computed: {
    transactions() {
      return this.$store.state.transactions;
    },
    filteredCryptoList() {
      const codes = this.$store.state.cryptoCodes;
      const predicate = (code) => this.transactions.some((t) => t.crypto_code === code);
      return codes.filter((item) => predicate(item.code));
    },
    totalResults() {
      return this.tableData.reduce((a, b) => a + b.result, 0);
    },
  },
};
</script>

<style scoped>
.red {
  color: red;
}
</style>
