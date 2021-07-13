<template>
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
          :key="transaction.id"
          @click="rowClick(transaction._id)"
          :class="{ selected: selectedId === transaction._id }"
        >
          <td>{{ transaction.crypto_code.toUpperCase() }}</td>
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
    getAction(action) {
      if (action === 'purchase') return 'Compra';
      return 'Venta';
    },
    getLocalizedDateTime(isoTime) {
      return new Date(isoTime).toLocaleString();
    },
    deleteTransaction() {
      this.$store.commit('deleteTransaction', this.selectedId);
    },
  },

  computed: {
    transactions() {
      return this.$store.state.transactions;
    },
  },
};
</script>

<style scoped>
table.green-table {
  border: 2px solid #24943a;
  background-color: #d4eed1;
  width: 75%;
  text-align: center;
  margin: auto;
  cursor: default;
}

table.green-table td,
table.green-table th {
  border: 1px solid #24943a;
  padding: 3px 2px;
}

table.green-table tbody td {
  font-size: 13px;
}

table.green-table thead {
  background: #24943a;
  background: -moz-linear-gradient(top, #5baf6b 0%, #3a9e4d 66%, #24943a 100%);
  background: -webkit-linear-gradient(
    top,
    #5baf6b 0%,
    #3a9e4d 66%,
    #24943a 100%
  );
  background: linear-gradient(to bottom, #5baf6b 0%, #3a9e4d 66%, #24943a 100%);
  border-bottom: 0px solid #444444;
}

table.green-table thead th {
  font-size: 19px;
  font-weight: bold;
  color: #f0f0f0;
  text-align: left;
  border-left: 2px solid #24943a;
}

table.green-table thead th:first-child {
  border-left: none;
}

table.green-table tfoot td {
  font-size: 13px;
}

table.green-table tfoot .links {
  text-align: right;
}

table.green-table tfoot .links a {
  display: inline-block;
  background: #ffffff;
  color: #24943a;
  padding: 2px 8px;
  border-radius: 5px;
}

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
