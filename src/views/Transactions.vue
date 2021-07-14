<template>
  <h1>Transacciones</h1>
  <div v-if="transactions.length > 0">
    <table class="green-table">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Monto</th>
          <th>Valor en ARS</th>
          <th>Acción</th>
          <th>Fecha y hora</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in transactions"
          :key="transaction._id"
          @click="rowClick(transaction._id)"
          :class="{ selected: selectedId === transaction._id }"
        >
          <td>{{ getCryptoName(transaction.crypto_code) }}</td>
          <td>{{ transaction.crypto_amount }}</td>
          <td>{{ transaction.money }}</td>
          <td>{{ getAction(transaction.action) }}</td>
          <td>{{ getLocalizedDateTime(transaction.datetime) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="buttons-container">
      <router-link :to="{ name: 'Buy' }">
        <button type="button">Comprar</button>
      </router-link>
      <router-link :to="{ name: 'Sell' }">
        <button type="button">Vender</button>
      </router-link>
      <router-link :to="{ name: 'Edit', query: { id: selectedId } }">
        <button type="button" :disabled="selectedId === null">
          Editar
        </button>
      </router-link>
      <button
        id="delete"
        type="button"
        :disabled="selectedId === null"
        @click="deleteTransaction"
      >
        Eliminar
      </button>
    </div>
  </div>
  <p v-else>No hay transacciones registradas hasta el momento.</p>
</template>

<script>
import apiServices from '@/services/apiServices.js';

export default {
  data() {
    return {
      selectedId: null,
    };
  },

  methods: {
    rowClick(id) {
      if (id !== this.selectedId) this.selectedId = id;
      else this.selectedId = null;
    },
    getCryptoName(code) {
      return this.cryptoList.find((item) => item.code === code).name;
    },
    getAction(action) {
      if (action === 'purchase') return 'Compra';
      return 'Venta';
    },
    getLocalizedDateTime(isoTime) {
      return new Date(isoTime).toLocaleString();
    },
    async deleteTransaction() {
      await apiServices.deleteTransaction(this.selectedId);
      this.$store.commit('deleteTransaction', this.selectedId);
    },
  },

  computed: {
    transactions() {
      return this.$store.state.transactions;
    },
    cryptoList() {
      return this.$store.state.cryptoCodes;
    },
  },
};
</script>

<style scoped>
.buttons-container {
  width: max-content;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  margin: auto;
  margin-top: 20px;
}

.selected {
  background-color: #42b983;
}
</style>
