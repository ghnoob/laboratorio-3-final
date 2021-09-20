import { shallowMount, mount, flushPromises } from '@vue/test-utils';
import apiServices from '@/services/apiServices';
import Transactions from '@/views/Transactions.vue';
import mockRouter from './mocks/mockRouter';
import mockCryptoCodes from './mocks/mockCryptoCodes';
import mockTransactions from './mocks/mockTransactions';

describe('Transactions.vue', () => {
  const $store = {
    state: {
      transactions: [],
      cryptoCodes: mockCryptoCodes,
    },
    commit: jest.fn(),
  };

  describe('Sin transacciones', () => {
    it('No se muestra la tabla', () => {
      const wrapper = shallowMount(Transactions, {
        global: {
          mocks: { $store },
          stubs: ['router-link'],
        },
      });

      expect(wrapper.find('table').exists()).toBe(false);
      expect(wrapper.find('p').text()).toBe('No hay transacciones registradas hasta el momento.');
    });
  });

  describe('Con transacciones', () => {
    beforeAll(() => {
      $store.state.transactions = mockTransactions;
    });

    const $toast = {
      show: jest.fn(),
      clear: jest.fn(),
      error: jest.fn(),
      success: jest.fn(),
    };

    it('Los datos de la tabla se renderizan correctamente', () => {
      const wrapper = shallowMount(Transactions, {
        global: {
          mocks: { $store },
          stubs: ['router-link'],
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('p').exists()).toBe(false);

      const cells = wrapper.findAll('tbody tr td');
      expect(cells.length).toBe(25);

      expect(cells[5].text()).toBe('USD Coin');
      expect(cells[6].text()).toBe('1.01');
      expect(cells[7].text()).toBe('165.23');
      expect(cells[8].text()).toBe('Compra');
      expect(cells[9].text()).toBe(new Date('2021-11-07T17:50:00.000Z').toLocaleString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }));

      expect(cells[10].text()).toBe('USD Coin');
      expect(cells[11].text()).toBe('1.01');
      expect(cells[12].text()).toBe('170.98');
      expect(cells[13].text()).toBe('Venta');
      expect(cells[14].text()).toBe(new Date('2021-11-07T20:50:00.000Z').toLocaleString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }));
    });

    it('Solo se puede editar y eliminar si hay una transaccion seleccionada', async () => {
      const wrapper = mount(Transactions, {
        global: {
          mocks: { $store },
          plugins: [mockRouter],
        },
      });

      const deleteButton = wrapper.find('#delete');
      const editButton = wrapper.find('#edit');

      expect(editButton.attributes('disabled')).toBe('');
      expect(deleteButton.attributes('disabled')).toBe('');

      const rows = wrapper.findAll('tbody tr');
      expect(rows.length).toBe(5);

      await rows[1].trigger('click');
      expect(rows[1].attributes('class')).toContain('bg-primary');
      expect(editButton.attributes('disabled')).toBe(undefined);
      // no se puede borrar la compra porque dejaría la cartera en negativo
      expect(deleteButton.attributes('disabled')).toBe('');

      await rows[0].trigger('click');
      expect(rows[1].attributes('class')).toBe('');
      expect(rows[0].attributes('class')).toContain('bg-primary');

      await rows[0].trigger('click');
      expect(rows[0].attributes('class')).toBe('');
      expect(rows[1].attributes('class')).toBe('');
      expect(editButton.attributes('disabled')).toBe('');
      expect(deleteButton.attributes('disabled')).toBe('');
    });

    it('Las transacciones se pueden borrar correctamente', async () => {
      apiServices.deleteTransaction = jest.fn();

      const wrapper = shallowMount(Transactions, {
        global: {
          mocks: { $store, $toast },
          stubs: ['router-link'],
        },
      });

      const deleteButton = wrapper.find('#delete');
      const rows = wrapper.findAll('tbody tr');

      await rows[2].trigger('click');
      await deleteButton.trigger('click');

      expect($toast.show).toHaveBeenCalled();

      expect(apiServices.deleteTransaction).toHaveBeenCalled();
      expect(apiServices.deleteTransaction).toHaveBeenCalledWith(mockTransactions[2]._id);

      await flushPromises();

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('deleteTransaction', mockTransactions[2]._id);

      expect($toast.clear).toHaveBeenCalled();
      expect($toast.success).toHaveBeenCalled();
    });

    it('Si hay un error al borrar se muestra un mensaje', async () => {
      apiServices.deleteTransaction = jest.fn(() => {
        throw new Error();
      });

      const wrapper = shallowMount(Transactions, {
        global: {
          mocks: { $store, $toast },
          stubs: ['router-link'],
        },
      });

      const deleteButton = wrapper.find('#delete');
      const rows = wrapper.findAll('tbody tr');

      await rows[2].trigger('click');
      await deleteButton.trigger('click');

      expect($toast.show).toHaveBeenCalled();

      expect(apiServices.deleteTransaction).toHaveBeenCalled();
      expect(apiServices.deleteTransaction).toHaveBeenCalledWith(mockTransactions[2]._id);

      await flushPromises();

      expect($toast.clear).toHaveBeenCalled();
      expect($toast.error).toHaveBeenCalled();
    });
  });
});
