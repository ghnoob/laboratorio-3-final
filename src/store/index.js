import { createStore } from 'vuex';
import apiServices from '../services/apiServices';

export default createStore({
  state() {
    return {
      username: '',
      transactions: [],
      cryptoCodes: [
        { code: 'btc', name: 'Bitcoin' },
        { code: 'eth', name: 'Ethereum' },
        { code: 'usdc', name: 'USD Coin' },
      ],
    };
  },
  mutations: {
    setUsername(state, name) {
      state.username = name;
    },
    setTransactions(state, arr) {
      state.transactions = arr;
    },
    pushTransaction(state, transaction) {
      state.transactions.push(transaction);
    },
    editTransaction(state, transaction) {
      const index = state.transactions.findIndex((elem) => elem._id === transaction._id);
      if (index >= 0) state.transactions[index] = transaction;
    },
    deleteTransaction(state, id) {
      state.transactions = state.transactions.filter((elem) => elem._id !== id);
    },
  },
  actions: {
    async pullTransactions({ commit, state }) {
      const response = await apiServices.getTransactions(state.username);
      commit('setTransactions', response.data);
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.username.length > 0;
    },
    wallet(state) {
      const wallet = {};

      state.cryptoCodes.forEach((item) => {
        wallet[item.code] = 0;
      });

      state.transactions.forEach((item) => {
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
});
