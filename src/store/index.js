import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      username: '',
      transactions: [],
      cryptoCodes: [
        {
          id: '1', code: 'btc', name: 'Bitcoin', color: '#ff9315',
        }, {
          id: '4943', code: 'dai', name: 'Dai', color: '#fd024f',
        }, {
          id: '1027', code: 'eth', name: 'Ethereum', color: '#5b73a0',
        }, {
          id: '3408', code: 'usdc', name: 'USD Coin', color: '#2775ca',
        },
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
      const index = state.transactions.findIndex((elem) => elem._id === id);
      if (index >= 0) {
        state.transactions.splice(index, 1);
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.username.length > 0;
    },
  },
});
