<template>
  <h1>Transacciones</h1>
  <div v-if="renderTable">
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
        <button id="edit" type="button" :disabled="selectedId === null">
          Editar
        </button>
      </router-link>
      <button
        id="delete"
        type="button"
        :disabled="!canDelete"
        @click="deleteTransaction"
      >
        Eliminar
      </button>
    </div>
  </div>
  <p v-else>No hay transacciones registradas hasta el momento.</p>
</template>

<script>
import apiServices from '../services/apiServices';

export default {
  data() {
    return {
      selectedId: null,
    };
  },

  methods: {
    rowClick(id) {
      if (id !== this.selectedId) {
        this.selectedId = id;
      } else {
        this.selectedId = null;
      }
    },
    getCryptoName(code) {
      return this.cryptoList.find((item) => item.code === code).name;
    },
    getAction(action) {
      if (action === 'purchase') {
        return 'Compra';
      }
      return 'Venta';
    },
    getLocalizedDateTime(isoTime) {
      return new Date(isoTime).toLocaleString();
    },
    async deleteTransaction() {
      try {
        this.$toast.show('Eliminando...');
        await apiServices.deleteTransaction(this.selectedId);
        this.$store.commit('deleteTransaction', this.selectedId);
        this.$toast.clear();
        this.selectedId = null;
      } catch {
        this.$toast.clear();
        this.$toast.error('Error', { duration: 2000 });
      }
    },
  },
  computed: {
    transactions() {
      const transactions = [...this.$store.state.transactions];
      transactions.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime));
      return transactions;
    },
    cryptoList() {
      return this.$store.state.cryptoCodes;
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
    canDelete() {
      if (this.selectedId === null) {
        return false;
      }
      const selectedTransaction = this.transactions.find((t) => t._id === this.selectedId);
      if (selectedTransaction.action === 'purchase') {
        const amountInWallet = this.wallet[selectedTransaction.crypto_code];
        return (amountInWallet - selectedTransaction.crypto_amount) >= 0;
      }
      return true;
    },
    renderTable() {
      return this.transactions.length > 0;
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
