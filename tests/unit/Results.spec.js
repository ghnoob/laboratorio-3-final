import { shallowMount, flushPromises } from '@vue/test-utils';
import exchangeServices from '@/services/exchangeServices';
import Results from '@/views/Results.vue';
import mockCryptoCodes from './mocks/mockCryptoCodes';
import mockTransactions from './mocks/mockTransactions';
import mockResponses from './mocks/mockResponses';

describe('Results.vue', () => {
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

  describe('Sin transacciones previas', () => {
    it('La tabla no se renderiza', () => {
      const wrapper = shallowMount(Results, {
        global: {
          mocks: { $store, $toast },
        },
      });

      expect(wrapper.find('table').exists()).toBe(false);
      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe('No se han registrado transacciones hasta el momento.');

      expect($toast.show).not.toHaveBeenCalled();
    });
  });

  describe('Con transacciones previas', () => {
    beforeAll(() => {
      $store.state.transactions = mockTransactions;
    });

    it('Los datos se deben mostrar correctamente', async () => {
      exchangeServices.getPriceByCrypto = jest.fn((code) => mockResponses[code]);

      const wrapper = shallowMount(Results, {
        global: {
          mocks: { $store, $toast },
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('p').exists()).toBe(false);

      expect($toast.show).toHaveBeenCalled();
      await flushPromises();
      expect($toast.clear).toHaveBeenCalled();
      expect($toast.success).toHaveBeenCalled();

      const cells = wrapper.findAll('tbody td');

      expect(cells.length).toBe(6);

      expect(cells[0].text()).toBe('Bitcoin');
      expect(cells[1].text()).toBe('$-3162.47');
      expect(cells[1].attributes('class')).toBe('red');

      expect(cells[2].text()).toBe('Ethereum');
      expect(cells[3].text()).toBe('$-2453.36');
      expect(cells[3].attributes('class')).toBe('red');

      expect(cells[4].text()).toBe('USD Coin');
      expect(cells[5].text()).toBe('$5.75');
      expect(cells[5].attributes('class')).not.toBe('red');

      const total = wrapper.find('tfoot td:nth-child(2)');
      expect(total.text()).toBe('$-5610.08');
      expect(total.attributes('class')).toBe('red');
    });

    it('Si hay un error se muestra un mensaje', async () => {
      exchangeServices.getPriceByCrypto = jest.fn(() => {
        throw new Error();
      });

      const wrapper = shallowMount(Results, {
        global: {
          mocks: { $store, $toast },
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('p').exists()).toBe(false);

      expect($toast.show).toHaveBeenCalled();
      await flushPromises();
      expect($toast.clear).toHaveBeenCalled();
      expect($toast.error).toHaveBeenCalled();
    });
  });
});
