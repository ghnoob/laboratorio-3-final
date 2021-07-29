import { shallowMount, flushPromises } from '@vue/test-utils';
import exchangeServices from '@/services/exchangeServices';
import Wallet from '@/views/Wallet.vue';

describe('Wallet.vue', () => {
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

  describe('Cartera vacía', () => {
    it('No se muestra la tabla', () => {
      const wrapper = shallowMount(Wallet, {
        global: {
          mocks: { $store },
        },
      });

      expect(wrapper.find('table').exists()).toBe(false);
      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe('La cartera está vacía.');
    });
  });

  describe('Con criptomonedas en la cartera', () => {
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
      {
        _id: '60eb148da4666761000216ff',
        crypto_code: 'eth',
        crypto_amount: '0.07',
        money: '25443.81',
        user_id: 'valor_introducido_login',
        action: 'purchase',
        datetime: '2021-07-23T22:30:00.000Z',
      },
    ];

    beforeAll(() => {
      $store.state.transactions = mockTransactions;

      const mockResponses = {
        btc: {
          data: {
            ask: 5912442.48,
            totalAsk: 5971566.9,
            bid: 5797256.86,
            totalBid: 5739284.29,
            time: 1626027655,
          },
        },
        eth: {
          data: {
            ask: 366459.91,
            totalAsk: 370124.51,
            bid: 351092.86,
            totalBid: 347581.93,
            time: 1627079748,
          },
        },
      };

      exchangeServices.getPriceByCrypto = jest.fn((code) => mockResponses[code]);
    });

    it('Los datos se renderizan correctamente', async () => {
      const wrapper = shallowMount(Wallet, {
        global: {
          mocks: { $store },
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('p').exists()).toBe(false);

      expect(wrapper.find('.chart-container').exists()).toBe(false);

      await flushPromises();

      const cells = wrapper.findAll('tbody td');

      expect(cells.length).toBe(6);

      expect(cells[0].text()).toBe('Bitcoin');
      expect(cells[1].text()).toBe('0.03');
      expect(cells[2].text()).toBe('$172178.53');

      expect(cells[3].text()).toBe('Ethereum');
      expect(cells[4].text()).toBe('0.07');
      expect(cells[5].text()).toBe('$24330.74');

      const total = wrapper.find('tfoot td:nth-child(3)');
      expect(total.text()).toBe('$196509.27');

      expect(wrapper.find('.chart-container').exists()).toBe(true);

      const expectedChartData = {
        datasets: [
          {
            data: [172178.53, 24330.74],
            backgroundColor: ['#ff9315', '#5b73a0'],
          },
        ],
        labels: ['Bitcoin', 'Ethereum'],
      };

      expect(wrapper.vm.chartData).toEqual(expectedChartData);
    });
  });
});
