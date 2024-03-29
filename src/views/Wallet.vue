<template>
  <h1>Cartera</h1>
  <div v-if="renderTable" class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th scope="column">Criptomoneda</th>
          <th scope="column">Cantidad</th>
          <th scope="column">Dinero</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="crypto in tableData" :key="crypto.code">
          <th scope="row">{{ crypto.name }}</th>
          <td>{{ crypto.amount }}</td>
          <td>${{ crypto.value }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <th scope="row">Total</th>
          <td>${{ moneyTotal.toFixed(2) }}</td>
        </tr>
      </tfoot>
    </table>
    <h2>Composición de la cartera</h2>
    <div class="chart-container m-auto mw-75" v-if="renderChart">
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
    if (this.renderTable) {
      this.loadData();
    }
  },
  methods: {
    fillTableData() {
      this.tableData = this.availableCryptos.map((crypto) => ({
        code: crypto,
        name: this.cryptoList.find((item) => item.code === crypto).name,
        amount: Math.round(this.wallet[crypto] * 10000) / 10000,
        value: 0, // seteado despues
      }));
    },
    async setTableDataValues() {
      await Promise.all(this.tableData.map(async (item) => {
        const response = await exchangeServices.getPriceByCrypto(item.code);
        item.value = Math.round((response.data.totalBid * item.amount) * 100) / 100;
      }));
    },
    async loadData() {
      try {
        this.$toast.show('Cargando cartera...');
        this.fillTableData();
        await this.setTableDataValues();
        this.$toast.clear();
        this.$toast.success('Cartera cargada');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
      }
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
  watch: {
    renderTable(value) {
      if (value) {
        this.loadData();
      }
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .chart-container {
    max-width: 50%;
  }
}

@media screen and (min-width: 1024px) {
  .chart-container {
    max-width: 35%;
  }
}
</style>
