<template>
  <div class="transaction">
    <form @submit.prevent="$emit('submitted', transaction)">
      <ul class="wrapper">
        <li class="form-row" v-if="edit">
          <label for="action">Acción</label>
          <select id="action" v-model="transaction.action">
            <option value="purchase">Comprar</option>
            <option value="sale">Vender</option>
          </select>
        </li>
        <li class="form-row">
          <label for="crypto-code">Criptomoneda</label>
          <select id="crypto-code" v-model="transaction.crypto_code" required>
            <option value="bitcoin">Bitcoin</option>
            <option value="eth">Ethereum</option>
            <option value="usdc">USD Coin</option>
            <option value="doge">Dogecoin</option>
          </select>
        </li>
        <li class="form-row">
          <label for="crypto-amount">Cantidad de criptomonedas{{ maxCryptoLabel }}</label>
          <input
            id="crypto-amount"
            type="number"
            min="0"
            :max="maxCryptoAmount"
            step="any"
            v-model="transaction.crypto_amount"
            required
          >
        </li>
        <li class="form-row">
          <label for="money">Dinero que se {{ moneyLabel }} (ARS)</label>
          <input id="money" type="number" min="0" step="any" v-model="transaction.money" required>
        </li>
        <li class="form-row">
          <label for="date">Fecha</label>
          <input
            id="date"
            type="date"
            v-model="date"
            :max="todaysDate()"
            autocomplete="off"
            required
          >
        </li>
        <li class="form-row">
          <label for="time">Hora</label>
          <input id="time" type="time" v-model="time" autocomplete="off" required>
        </li>
        <li class="form-row">
          <button type="submit">Aceptar</button>
          <button type="button" @click="$router.go(-1)">Cancelar</button>
        </li>
      </ul>
    </form>
  </div>
</template>

<script>
export default {
  name: 'TransactionForm',
  props: {
    action: {
      type: String,
      required: false,
    },
    edit: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      date: this.todaysDate(),
      time: '',
      transaction: {
        user_id: '',
        action: this.action,
        crypto_code: '',
        crypto_amount: '',
        money: '',
        datetime: '',
      },
    };
  },
  mounted() {
    if (this.action === undefined) {
      const elem = this.$store.state.transactions.find((x) => x._id === this.id);
      this.transaction = elem;
      this.datetime = elem.datetime;
    } else {
      this.transaction.user_id = this.$store.state.username;
    }
  },
  methods: {
    todaysDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate();

      return `${year}-${month}-${day}`;
    },
  },
  computed: {
    datetime: {
      get() {
        return `${this.date} ${this.time}`.trim();
      },
      set(newValue) {
        const dt = newValue.split('T');
        dt[1] = dt[1].slice(0, 5);
        [this.date, this.time] = [dt[0], dt[1]];
      },
    },
    moneyLabel() {
      if (this.transaction.action === 'purchase') return 'pagó';
      return 'recibió';
    },
    maxCryptoAmount() {
      if (this.transaction.action === 'sale') {
        return this.$store.getters.wallet[this.transaction.crypto_code];
      }
      return Number.MAX_SAFE_INTEGER;
    },
    maxCryptoLabel() {
      if (this.transaction.action === 'sale' && this.maxCryptoAmount !== undefined) {
        return ` (max. ${this.maxCryptoAmount})`;
      }
      return '';
    },
  },
  watch: {
    datetime(value) {
      this.transaction.datetime = new Date(value).toISOString();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  background-color: whitesmoke;
  list-style-type: none;
  padding: 0;
  border-radius: 3px;
}
.form-row {
  display: flex;
  justify-content: flex-end;
  padding: 0.5em;
}

button {
  margin: 2px;
  width: 80px;
  height: 30px;
  padding: 0.5em;
}

.form-row > label {
  padding: 0.5em 1em 0.5em 0;
  text-align: right;
  flex: 1;
}
.form-row > input,
.form-row > select {
  flex: 2;
}
.form-row > input,
.form-row > select {
  padding: 0.5em;
}

@media screen and (min-width: 768px) {
  .form-row > input,
  .form-row > select {
    flex: 3;
  }
}
@media screen and (min-width: 992px) {
  .form-row > input,
  .form-row > select {
    flex: 4;
  }
}
@media screen and (min-width: 1200px) {
  .form-row > input,
  .form-row > select {
    flex: 5;
  }
}
</style>
