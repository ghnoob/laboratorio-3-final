import { shallowMount, flushPromises } from '@vue/test-utils';
import exchangeServices from '@/services/exchangeServices';
import Wallet from '@/views/Wallet.vue';
import mockCryptoCodes from './mocks/mockCryptoCodes';
import mockTransactions from './mocks/mockTransactions';
import mockResponses from './mocks/mockResponses';

describe('Wallet.vue', () => {
  const $store = {
    state: {
      transactions: [],
      cryptoCodes: mockCryptoCodes,
    },
  };

  const $toast = {
    show: jest.fn(),
    error: jest.fn(),
    clear: jest.fn(),
    success: jest.fn(),
  };

  describe('Cartera vacía', () => {
    it('No se muestra la tabla', () => {
      const wrapper = shallowMount(Wallet, {
        global: {
          mocks: { $store, $toast },
        },
      });

      expect(wrapper.find('table').exists()).toBe(false);
      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe('La cartera está vacía.');

      expect($toast.show).not.toHaveBeenCalled();
    });
  });

  describe('Con criptomonedas en la cartera', () => {
    beforeAll(() => {
      $store.state.transactions = mockTransactions;
    });

    it('Los datos se renderizan correctamente', async () => {
      exchangeServices.getPriceByCrypto = jest.fn((code) => mockResponses[code]);

      const wrapper = shallowMount(Wallet, {
        global: {
          mocks: { $store, $toast },
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('p').exists()).toBe(false);

      expect(wrapper.find('.chart-container').exists()).toBe(false);

      expect($toast.show).toHaveBeenCalled();

      await flushPromises();

      expect($toast.clear).toHaveBeenCalled();
      expect($toast.success).toHaveBeenCalled();

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

    it('Si hay un error se muestra un mensaje', async () => {
      exchangeServices.getPriceByCrypto = jest.fn(() => {
        throw new Error();
      });

      shallowMount(Wallet, {
        global: {
          mocks: { $store, $toast },
        },
      });

      expect($toast.show).toHaveBeenCalled();

      await flushPromises();

      expect($toast.clear).toHaveBeenCalled();
      expect($toast.error).toHaveBeenCalled();
    });
  });
});
