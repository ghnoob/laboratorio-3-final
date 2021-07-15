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
  </div>
  <p v-else>La cartera está vacía.</p>
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
        const response = await axios.get(`https://criptoya.com/api/satoshitango/${item.code}/ars`);
        item.value = response.data.totalBid * item.amount;
      });
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
    moneyTotal() {
      return this.tableData.reduce((a, b) => a + b.value, 0);
    },
  },
};
</script>
