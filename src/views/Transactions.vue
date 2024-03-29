<template>
  <div class="transactions m-1">
    <h1>Transacciones</h1>
    <div v-if="renderTable">
      <div class="table-responsive">
        <table class="table">
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
              :class="{ 'bg-primary text-light': selectedId === transaction._id }"
            >
              <td>{{ getCryptoName(transaction.crypto_code) }}</td>
              <td>{{ transaction.crypto_amount }}</td>
              <td>{{ transaction.money }}</td>
              <td>{{ getAction(transaction.action) }}</td>
              <td>{{ getLocalizedDateTime(transaction.datetime) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-around">
        <router-link :to="{ name: 'Buy' }">
          <button class="btn btn-primary btn-sm" type="button">Comprar</button>
        </router-link>
        <router-link :to="{ name: 'Sell' }">
          <button class="btn btn-primary btn-sm" type="button">Vender</button>
        </router-link>
        <router-link :to="{ name: 'Edit', query: { id: selectedId } }">
          <button
            class="btn btn-warning btn-sm"
            id="edit"
            type="button"
            :disabled="selectedId === null"
          >
            Editar
          </button>
        </router-link>
        <button
          id="delete"
          class="btn btn-danger btn-sm"
          type="button"
          :disabled="!canDelete"
          @click="deleteTransaction"
        >
          Eliminar
        </button>
      </div>
    </div>
    <p v-else>No hay transacciones registradas hasta el momento.</p>
  </div>
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
      return new Date(isoTime).toLocaleString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    async deleteTransaction() {
      try {
        this.$toast.show('Eliminando...', { duration: false });
        await apiServices.deleteTransaction(this.selectedId);
        this.$store.commit('deleteTransaction', this.selectedId);
        this.selectedId = null;
        this.$toast.clear();
        this.$toast.success('Eliminado');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
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
