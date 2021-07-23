import axios from 'axios';
import { shallowMount, flushPromises } from '@vue/test-utils';
import Results from '@/views/Results.vue';

describe('Results.vue', () => {
  const $store = {
    state: {
      transactions: [],
      cryptoCodes: [
        { code: 'btc', name: 'Bitcoin', color: '#ff9315' },
        { code: 'dai', name: 'Dai', color: '#fd024f' },
        { code: 'eth', name: 'Ethereum', color: '#5b73a0' },
        { code: 'usdc', name: 'USD Coin', color: '#2775ca' },
      ],
    },
  };

  describe('Sin transacciones previas', () => {
    it('La tabla no se renderiza', () => {
      const wrapper = shallowMount(Results, {
        global: {
          mocks: { $store },
        },
      });

      expect(wrapper.find('table').exists()).toBe(false);
      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe('No se han registrado transacciones hasta el momento.');
    });
  });

  describe('Con transacciones previas', () => {
    const mockTransactions = [
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
        crypto_code: 'btc',
        crypto_amount: '0.01',
        money: '58447',
        user_id: 'valor_introducido_login',
        action: 'purchase',
        datetime: '2021-11-11T17:50:00.000Z',
      },
      {
        _id: '60eb148da4666761000216f5',
        crypto_code: 'btc',
        crypto_amount: '0.02',
        money: '116894',
        user_id: 'valor_introducido_login',
        action: 'purchase',
        datetime: '2021-11-12T17:50:00.000Z',
      },
    ];

    beforeAll(() => {
      $store.state.transactions = mockTransactions;
    });

    it('Los datos se deben mostrar correctamente', async () => {
      axios.get = jest.fn(() => ({
        data: {
          ask: 5912442.48,
          totalAsk: 5971566.9,
          bid: 5797256.86,
          totalBid: 5739284.29,
          time: 1626027655,
        },
      }));

      const wrapper = shallowMount(Results, {
        global: {
          mocks: { $store },
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('p').exists()).toBe(false);

      await flushPromises();

      const cells = wrapper.findAll('tbody td');

      expect(cells.length).toBe(4);

      expect(cells[0].text()).toBe('Bitcoin');
      expect(cells[1].text()).toBe('$-3162.47');
      expect(cells[1].attributes('class')).toBe('red');
      expect(cells[2].text()).toBe('USD Coin');
      expect(cells[3].text()).toBe('$5.75');

      const total = wrapper.find('tfoot td:nth-child(2)');
      expect(total.text()).toBe('$-3156.72');
      expect(total.attributes('class')).toBe('red');
    });
  });
});
