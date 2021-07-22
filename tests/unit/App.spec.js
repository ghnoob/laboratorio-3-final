import { nextTick } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import App from '@/App.vue';

const mockTransactions = [
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
    _id: '60eb148da4666761000216f9',
    crypto_code: 'usdc',
    crypto_amount: '1.01',
    money: '165.23',
    user_id: 'valor_introducido_login',
    action: 'purchase',
    datetime: '2021-11-07T17:50:00.000Z',
  },
];

const mockPrices = [
  {
    code: 'btc',
    exchanges: [
      {
        exchange: 'satoshitango',
        bid: 5394165,
        ask: 5736558.69,
      },
      {
        exchange: 'sesocio',
        bid: 5569884.73,
        ask: 5744973.91,
      },
    ],
  },
  {
    code: 'dai',
    exchanges: [
      {
        exchange: 'satoshitango',
        bid: 166.81,
        ask: 177.32,
      },
      {
        exchange: 'sesocio',
        bid: 169.53,
        ask: 178.62,
      },
    ],
  },
  {
    code: 'eth',
    exchanges: [
      {
        exchange: 'satoshitango',
        bid: 336427.37,
        ask: 358024.52,
      },
      {
        exchange: 'sesocio',
        bid: 342712.5,
        ask: 359623.4,
      },
    ],
  },
  {
    code: 'usdc',
    exchanges: [
      {
        exchange: 'satoshitango',
        bid: 166.82,
        ask: 177.44,
      },
      {
        exchange: 'sesocio',
        bid: 169.53,
        ask: 178.62,
      },
    ],
  },
];

describe('App.vue', () => {
  describe('Sin haber ingresado', () => {
    const $store = {
      state: { transactions: [], username: '' },
      commit: jest.fn(),
    };

    it('Si se está en la pantalla de login no se muestra ningún link', () => {
      const $route = { name: 'Login' };
      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store, $route },
          stubs: ['router-link', 'router-view'],
        },
      });

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('setPrices');

      expect(wrapper.find('#nav').exists()).toBe(false);
    });

    it('Si no se está en la pantalla de login se muestra un link a esta', () => {
      const $route = { name: 'NotFound' };

      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store, $route },
          stubs: ['router-link', 'router-view'],
        },
      });

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('setPrices');

      expect(wrapper.findAll('.link').length).toBe(1);
    });
  });

  describe('Habiendo ingresado', () => {
    it('Si el usuario ingresó se muestran los links para navegar libremente por la página', () => {
      const $store = {
        state: { transactions: [], username: 'test' },
        commit: jest.fn(),
      };

      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store },
          stubs: ['router-link', 'router-view'],
        },
      });

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('setPrices');

      expect(wrapper.findAll('.link').length).toBe(5);
    });

    it('Cuando cargan las transacciones los mensajes de carga desaparecen', async () => {
      const store = createStore({
        state: {
          username: 'valor_introducido_login',
          transactions: [],
        },
        mutations: {
          setPrices(state) {
            state.prices = mockPrices;
          },
          setTransactions(state) {
            state.transactions = mockTransactions;
          },
        },
      });

      const $toast = { clear: jest.fn() };

      shallowMount(App, {
        global: {
          plugins: [store],
          mocks: { $toast },
          stubs: ['router-link', 'router-view'],
        },
      });

      store.commit('setTransactions');
      await nextTick();
      expect($toast.clear).toHaveBeenCalled();
    });
  });
});
