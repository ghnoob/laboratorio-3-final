import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      username: '',
      transactions: [],
      cryptoCodes: [
        { code: 'btc', name: 'Bitcoin', color: '#ff9315' },
        { code: 'dai', name: 'Dai', color: '#fd024f' },
        { code: 'eth', name: 'Ethereum', color: '#5b73a0' },
        { code: 'usdc', name: 'USD Coin', color: '#2775ca' },
      ],
      prices: [],
    };
  },
  mutations: {
    setUsername(state, name) {
      state.username = name;
    },
    setTransactions(state, arr) {
      state.transactions = arr;
    },
    setPrices(state, priceList) {
      state.prices = priceList;
    },
    pushTransaction(state, transaction) {
      state.transactions.push(transaction);
    },
    editTransaction(state, transaction) {
      const index = state.transactions.findIndex((elem) => elem._id === transaction._id);
      if (index >= 0) {
        state.transactions[index] = transaction;
      }
    },
    deleteTransaction(state, id) {
      state.transactions = state.transactions.filter((elem) => elem._id !== id);
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.username.length > 0;
    },
  },
});
