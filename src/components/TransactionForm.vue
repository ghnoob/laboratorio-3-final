<template>
  <div class="transaction">
    <form @submit.prevent="$emit('submitted', newTransaction)">
      <ul class="wrapper">
        <li class="form-row" v-if="edit">
          <label for="action">Acción</label>
          <select id="action" v-model="newTransaction.action">
            <option value="purchase">Comprar</option>
            <option value="sale">Vender</option>
          </select>
        </li>
        <li class="form-row">
          <label for="crypto-code">Criptomoneda</label>
          <select
            id="crypto-code"
            v-model="newTransaction.crypto_code"
            required
          >
            <option v-for="crypto in cryptoList" :key="crypto.code" :value="crypto.code">
              {{ crypto.name }}
            </option>
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
            v-model="newTransaction.crypto_amount"
            required
            @input="setMoney"
          >
        </li>
        <li class="form-row" v-if="newTransaction.crypto_code !== ''">
          <label for="exchange">Exchange</label>
          <select id="exchange" v-model="exchangeRate" @change="setMoney">
            <option
              v-for="(item, i) in prices"
              :key="item.exchange"
              :value="item[priceType]"
            >
              {{ item.exchange }} - 1 ARS = {{ item[priceType] }}
              {{ newTransaction.crypto_code.toUpperCase() }}{{i === 0 ? ' (recomendado)' : ''}}
            </option>
            <option :value="null">otro</option>
          </select>
        </li>
        <li class="form-row">
          <label for="money">Dinero que se {{ moneyLabel }} (ARS)</label>
          <input
            id="money"
            type="number"
            min="0"
            step="0.01"
            v-model="newTransaction.money"
            required
          >
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
          <button type="button" @click="$store.commit('setPrices')">Refrescar exchanges</button>
          <button type="submit">Aceptar</button>
          <router-link :to="{ name: 'Transactions' }">
            <button type="button">Cancelar</button>
          </router-link>
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
      time: this.currentTime(),
      exchangeRate: null,
      oldTransaction: {},
      newTransaction: {
        _id: null,
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
    if (this.edit) {
      this.oldTransaction = { ...this.$store.state.transactions.find((x) => x._id === this.id) };
      this.newTransaction = { ...this.oldTransaction };
      this.datetime = new Date(this.newTransaction.datetime);
    } else {
      this.newTransaction.user_id = this.$store.state.username;
      this.newTransaction.datetime = this.datetime;
    }
  },
  methods: {
    todaysDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    currentTime() {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    setMoney() {
      if (this.exchangeRate !== null) {
        const newVal = (this.exchangeRate * this.newTransaction.crypto_amount).toFixed(2);
        this.newTransaction.money = newVal;
      }
    },
  },
  computed: {
    datetime: {
      get() {
        return `${this.date} ${this.time}`.trim();
      },
      set(dt) {
        const month = (dt.getMonth() + 1).toString().padStart(2, '0');
        const day = dt.getDate().toString().padStart(2, '0');
        this.date = `${dt.getFullYear()}-${month}-${day}`;
        this.time = `${dt.getHours()}:${dt.getMinutes()}`;
      },
    },
    moneyLabel() {
      if (this.newTransaction.action === 'purchase') return 'pagó';
      return 'recibió';
    },
    maxCryptoAmount() {
      const inWallet = this.wallet[this.newTransaction.crypto_code];

      if (this.action === 'sale') return inWallet;
      if (this.action === 'purchase') return Number.MAX_SAFE_INTEGER;

      return inWallet + parseFloat(this.oldTransaction.crypto_amount);
    },
    maxCryptoLabel() {
      if (this.newTransaction.action === 'sale') {
        return ` (max. ${this.maxCryptoAmount})`;
      }
      return '';
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
    prices() {
      if (this.newTransaction.crypto_code !== '') {
        const predicate = (item) => item.code === this.newTransaction.crypto_code;
        const priceList = [...this.$store.state.prices.find(predicate).exchanges];
        if (this.newTransaction.action === 'purchase') {
          priceList.sort((a, b) => a.ask - b.ask);
        } else {
          priceList.sort((a, b) => a.bid - b.bid);
          priceList.reverse();
        }
        return priceList;
      }
      return [];
    },
    priceType() {
      return this.newTransaction.action === 'purchase' ? 'ask' : 'bid';
    },
  },
  watch: {
    datetime(value) {
      this.newTransaction.datetime = new Date(value).toISOString();
    },
    prices(newPrices) {
      if (newPrices.length < 1) {
        this.$toast.show('Refrescando...');
      } else {
        if (!this.edit) {
          this.exchangeRate = newPrices[0][this.priceType];
        }
        this.$toast.clear();
        this.setMoney();
      }
    },
  },
};
</script>

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
  height: 50px;
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
