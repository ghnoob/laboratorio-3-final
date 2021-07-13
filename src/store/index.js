import { createStore } from 'vuex';

export default createStore({
  state: {
    username: '',
    // TODO: buscar datos de la API
    transactions: [
      {
        _id: '60eb148da4666761000216f9',
        crypto_code: 'usdc',
        crypto_amount: '1.01',
        money: '165.23',
        user_id: 'valor_introducido_login',
        action: 'purchase',
        datetime: '2021-11-07T17:50:00.000Z',
      },
      {
        _id: '60eb149ba4666761000216fc',
        crypto_code: 'usdc',
        crypto_amount: '1.01',
        money: '170.98',
        user_id: 'valor_introducido_login',
        action: 'sale',
        datetime: '2021-11-07T20:50:00.000Z',
      },
      {
        _id: '60eb148da4666761000216f7',
        crypto_code: 'bitcoin',
        crypto_amount: '0.01',
        money: '58447',
        user_id: 'valor_introducido_login',
        action: 'purchase',
        datetime: '2021-11-11T17:50:00.000Z',
      },
      {
        _id: '60eb148da4666761000216f5',
        crypto_code: 'bitcoin',
        crypto_amount: '0.02',
        money: '116894',
        user_id: 'valor_introducido_login',
        action: 'purchase',
        datetime: '2021-11-12T17:50:00.000Z',
      },
    ],
  },
  mutations: {
    setUsername(state, name) {
      state.username = name;
    },
    pushTransaction(state, transaction) {
      state.transactions.push(transaction);
    },
    editTransaction(state, transaction) {
      const index = state.transactions.find((elem) => elem._id === transaction._id);
      if (index >= 0) state.transactions[index] = transaction;
    },
    deleteTransaction(state, id) {
      state.transactions = state.transactions.filter((elem) => elem._id !== id);
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.username.length > 0;
    },
    wallet(state) {
      const wallet = {
        bitcoin: 0,
        eth: 0,
        usdc: 0,
        doge: 0,
      };

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
