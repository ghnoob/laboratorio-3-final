import { createStore } from 'vuex';
import axios from 'axios';
import apiServices from '../services/apiServices';

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
    setPrices(state) {
      state.prices = state.cryptoCodes.map((item) => ({ code: item.code, exchanges: [] }));
      state.prices.forEach(async (item) => {
        const response = await axios.get(`https://criptoya.com/api/${item.code}/ars`);
        item.exchanges = Object.keys(response.data).map((exchange) => (
          {
            exchange,
            bid: response.data[exchange].totalBid,
            ask: response.data[exchange].totalAsk,
          }));
      });
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
