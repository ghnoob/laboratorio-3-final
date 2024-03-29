<template>
  <div class="transaction">
    <form @submit.prevent="$emit('submitted', newTransaction)" class="mx-1">
      <div class="mb-3" v-if="edit">
        <label class="form-label" for="action">Acción</label>
        <select id="action" class="form-select" v-model="newTransaction.action">
          <option value="purchase">Comprar</option>
          <option value="sale">Vender</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label" for="crypto-code">Criptomoneda</label>
        <select
          id="crypto-code"
          class="form-select"
          v-model="newTransaction.crypto_code"
          required
        >
          <option v-for="crypto in cryptoList" :key="crypto.code" :value="crypto.code">
            {{ crypto.name }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label" for="crypto-amount">{{ cryptoAmountLabel }}</label>
        <input
          id="crypto-amount"
          class="form-control"
          type="number"
          :min="minCryptoAmount"
          :max="maxCryptoAmount"
          step="any"
          v-model="newTransaction.crypto_amount"
          required
          @input="setMoney"
        >
      </div>
      <div class="mb-3" v-if="newTransaction.crypto_code !== ''">
        <label class="form-label" for="exchange">Exchange</label>
        <select id="exchange" class="form-select" v-model="exchangeRate" @change="setMoney">
          <option
            v-for="(item, i) in prices"
            :key="item.exchange"
            :value="item[priceType]"
          >
            {{ item.exchange }} - 1 {{ newTransaction.crypto_code.toUpperCase() }} =
            {{ item[priceType] }} ARS {{i === 0 ? '(recomendado)' : ''}}
          </option>
          <option :value="null">otro</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label" for="money">{{ moneyLabel }}</label>
        <input
          id="money"
          class="form-control"
          type="number"
          min="0"
          step="0.01"
          v-model="newTransaction.money"
          required
        >
      </div>
      <div class="mb-3">
        <label class="form-label" for="date">Fecha</label>
        <input
          id="date"
          class="form-control"
          type="date"
          v-model="date"
          :max="todaysDate()"
          autocomplete="off"
          required
        >
      </div>
      <div class="mb-3">
        <label class="form-label" for="time">Hora</label>
        <input
          class="form-control"
          id="time"
          type="time"
          v-model="time"
          autocomplete="off"
          required
        >
      </div>
      <div class="d-flex" role="group">
        <button class="btn btn-secondary btn-sm" id="update" type="button" @click="updateExchanges">
          Refrescar exchanges
        </button>
        <div class="ms-auto">
          <button class="btn btn-primary btn-sm" type="submit">Aceptar</button>
          <router-link :to="{ name: 'Transactions' }">
            <button class="btn btn-secondary btn-sm" type="button">Cancelar</button>
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import exchangeServices from '../services/exchangeServices';

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
      this.newTransaction.datetime = new Date(this.datetime).toISOString();
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
    async updateExchanges() {
      try {
        this.$toast.show('Refrescando...', { duration: false });
        const newPrices = await exchangeServices.getPrices();
        this.$toast.clear();
        this.$toast.success('Refresacado');
        this.$store.commit('setPrices', newPrices);
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
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

        const hours = dt.getHours().toString().padStart(2, '0');
        const minutes = dt.getMinutes().toString().padStart(2, '0');
        this.time = `${hours}:${minutes}`;
      },
    },
    moneyLabel() {
      const action = this.newTransaction.action === 'purchase' ? 'pagó' : 'recibió';
      return `Dinero que se ${action} (ARS)`;
    },
    minCryptoAmount() {
      if (!this.edit || this.newTransaction.action === 'sale') {
        return 0;
      }
      const amountInWallet = this.wallet[this.newTransaction.crypto_code];
      const oldTransactionAmount = parseFloat(this.oldTransaction.crypto_amount);
      let withoutOldAmount = amountInWallet;
      if (this.oldTransaction.action === 'purchase') {
        withoutOldAmount -= oldTransactionAmount;
      } else {
        withoutOldAmount += oldTransactionAmount;
      }
      return withoutOldAmount >= 0 ? 0 : Math.abs(Math.round(withoutOldAmount * 1000) / 1000);
    },
    maxCryptoAmount() {
      if (this.newTransaction.action === 'purchase') {
        return Number.MAX_SAFE_INTEGER;
      }
      const inWallet = this.wallet[this.newTransaction.crypto_code];
      if (!this.edit) {
        return Math.round(inWallet * 1000) / 1000;
      }
      if (this.oldTransaction.action === 'purchase') {
        let maxAmount = inWallet - parseFloat(this.oldTransaction.crypto_amount);
        maxAmount = Math.round(maxAmount * 1000) / 1000;
        return maxAmount > 0 ? maxAmount : 0;
      }
      return Math.round((inWallet + parseFloat(this.oldTransaction.crypto_amount)) * 1000) / 1000;
    },
    cryptoAmountLabel() {
      let action = this.newTransaction.action === 'purchase' ? 'comprar' : 'vender';
      if (action === 'vender' && this.newTransaction.crypto_code !== '') {
        action += ` (max. ${this.maxCryptoAmount})`;
      }
      if (action === 'comprar' && this.minCryptoAmount > 0) {
        action += ` (min. ${this.minCryptoAmount})`;
      }
      return `Cantidad de criptomonedas a ${action}`;
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
      if (!this.edit && newPrices.length > 0) {
        this.exchangeRate = newPrices[0][this.priceType];
        this.setMoney();
      }
    },
  },
};
</script>
