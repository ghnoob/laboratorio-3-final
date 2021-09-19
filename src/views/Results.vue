<template>
  <h1>Resultados</h1>
  <div v-if="renderTable" class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th scope="column">Criptomoneda</th>
          <th scope="column">Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="crypto in tableData" :key="crypto.code">
          <th scope="row">{{ crypto.name }}</th>
          <td :class="cellColor(crypto.result)">${{ crypto.result.toFixed(2) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Total</th>
          <td :class="cellColor(totalResults)">${{ totalResults.toFixed(2) }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
  <p v-else>No se han registrado transacciones hasta el momento.</p>
</template>

<script>
import exchangeServices from '../services/exchangeServices';

export default {
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
      this.tableData = this.filteredCryptoList.map((item) => ({
        code: item.code,
        name: item.name,
        result: 0, // seteado despues
      }));
    },
    async setResults() {
      await Promise.all(this.tableData.map(async (item) => {
        const operations = this.transactions.filter((t) => t.crypto_code === item.code);

        let income = 0;
        let spendings = 0;
        let currentValue = 0;

        operations.forEach((op) => {
          if (op.action === 'sale') {
            income += parseFloat(op.money);
          } else {
            spendings += parseFloat(op.money);
          }
        });

        const amountInWallet = this.wallet[item.code];
        if (amountInWallet > 0) {
          const response = await exchangeServices.getPriceByCrypto(item.code);
          currentValue = response.data.totalBid * amountInWallet;
        }

        item.result = Math.round((currentValue - spendings + income) * 100) / 100;
      }));
    },
    async loadData() {
      try {
        this.$toast.show('Cargando resultados', { duration: false });
        this.fillTableData();
        await this.setResults();
        this.$toast.clear();
        this.$toast.success('Resultados cargados');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
      }
    },

    cellColor(n) {
      if (n > 0) {
        return 'table-success';
      }

      if (n < 0) {
        return 'table-danger';
      }

      return '';
    },
  },
  computed: {
    transactions() {
      return this.$store.state.transactions;
    },
    renderTable() {
      return this.transactions.length > 0;
    },
    filteredCryptoList() {
      const codes = this.$store.state.cryptoCodes;
      const predicate = (code) => this.transactions.some((t) => t.crypto_code === code);
      return codes.filter((item) => predicate(item.code));
    },
    totalResults() {
      return this.tableData.reduce((a, b) => a + b.result, 0);
    },
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
