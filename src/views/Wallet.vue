<template>
  <h1>Cartera</h1>
  <div v-if="renderTable">
    <table class="green-table">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Dinero</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="crypto in tableData" :key="crypto.code">
          <td>{{ crypto.name }}</td>
          <td>{{ crypto.amount }}</td>
          <td>${{ crypto.value.toFixed(2) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td>Total</td>
          <td>${{ moneyTotal.toFixed(2) }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="chart-container" v-if="renderChart">
      <h2>Composición de la cartera</h2>
      <wallet-chart :chart-data="chartData" :chart-options="{ responsive: true }" />
    </div>
  </div>
  <p v-else>La cartera está vacía.</p>
</template>

<script>
import exchangeServices from '../services/exchangeServices';
import WalletChart from '../components/WalletChart.vue';

export default {
  components: {
    WalletChart,
  },
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.fillTableData();
    this.setTableDataValues();
  },
  methods: {
    fillTableData() {
      this.tableData = this.availableCryptos.map((crypto) => ({
        code: crypto,
        name: this.cryptoList.find((item) => item.code === crypto).name,
        amount: this.wallet[crypto],
        value: 0, // seteado despues
      }));
    },
    setTableDataValues() {
      this.tableData.forEach(async (item) => {
        const response = await exchangeServices.getPriceByCrypto(item.code);
        item.value = Math.round((response.data.totalBid * item.amount) * 100) / 100;
      });
    },
  },
  computed: {
    wallet() {
      const wallet = {};

      this.$store.state.cryptoCodes.forEach((item) => {
        wallet[item.code] = 0;
      });

      this.$store.state.transactions.forEach((item) => {
        const amount = parseFloat(item.crypto_amount);
        if (item.action === 'purchase') {
          wallet[item.crypto_code] += amount;
        } else {
          wallet[item.crypto_code] -= amount;
        }
      });

      return wallet;
    },
    availableCryptos() {
      return Object.keys(this.wallet).filter((item) => this.wallet[item] > 0);
    },
    cryptoList() {
      return this.$store.state.cryptoCodes;
    },
    moneyTotal() {
      return this.tableData.reduce((a, b) => a + b.value, 0);
    },
    chartData() {
      return {
        datasets: [
          {
            data: this.tableData.map((item) => item.value),
            // eslint-disable-next-line
            backgroundColor: this.tableData.map((item) => this.cryptoList.find((crypto) => crypto.code === item.code).color),
          },
        ],
        labels: this.tableData.map((item) => item.name),
      };
    },
    renderChart() {
      return this.tableData.length > 0 && this.tableData.every((crypto) => crypto.value > 0);
    },
    renderTable() {
      return this.availableCryptos.length > 0;
    },
  },
};
</script>

<style scoped>
.chart-container {
  max-width: 35%;
  margin: auto;
  margin-top: 5em;
}
</style>
