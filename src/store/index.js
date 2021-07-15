import { createStore } from 'vuex';
import apiServices from '../services/apiServices';

export default createStore({
  state() {
    return {
      username: '',
      transactions: [],
      cryptoCodes: [
        { code: 'btc', name: 'Bitcoin', color: '#ff9315' },
        { code: 'eth', name: 'Ethereum', color: '#5b73a0' },
        { code: 'usdc', name: 'USD Coin', color: '#2775ca' },
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
  },
});
