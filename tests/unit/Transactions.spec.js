import { shallowMount, mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import apiServices from '@/services/apiServices';
import Transactions from '@/views/Transactions.vue';

const mockRouter = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/buy',
      name: 'Buy',
      meta: { requiresAuth: true },
      component: () => import('@/views/Buy.vue'),
    },
    {
      path: '/sell',
      name: 'Sell',
      meta: { requiresAuth: true },
      component: () => import('@/views/Sell.vue'),
    },
    {
      path: '/edit',
      name: 'Edit',
      meta: { requiresAuth: true },
      component: () => import('@/views/Edit.vue'),
    },
  ],
});

describe('Transactions.vue', () => {
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
    ];

    beforeAll(() => {
      $store.state.transactions = mockTransactions;
    });

    const $toast = {
      show: jest.fn(),
      clear: jest.fn(),
      error: jest.fn(),
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
      expect(cells.length).toBe(10);

      expect(cells[0].text()).toBe('USD Coin');
      expect(cells[1].text()).toBe('1.01');
      expect(cells[2].text()).toBe('165.23');
      expect(cells[3].text()).toBe('Compra');
      expect(cells[4].text()).toBe(new Date('2021-11-07T17:50:00.000Z').toLocaleString());

      expect(cells[5].text()).toBe('USD Coin');
      expect(cells[6].text()).toBe('1.01');
      expect(cells[7].text()).toBe('170.98');
      expect(cells[8].text()).toBe('Venta');
      expect(cells[9].text()).toBe(new Date('2021-11-07T20:50:00.000Z').toLocaleString());
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
      expect(rows.length).toBe(2);

      await rows[0].trigger('click');
      expect(rows[0].attributes('class')).toBe('selected');
      expect(editButton.attributes('disabled')).toBe(undefined);
      // no se puede borrar la venta porque dejaría la cartera en negativo
      expect(deleteButton.attributes('disabled')).toBe('');

      await rows[1].trigger('click');
      expect(rows[0].attributes('class')).toBe('');
      expect(rows[1].attributes('class')).toBe('selected');

      await rows[1].trigger('click');
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

      await rows[1].trigger('click');
      await deleteButton.trigger('click');

      expect($toast.show).toHaveBeenCalled();

      expect(apiServices.deleteTransaction).toHaveBeenCalled();
      expect(apiServices.deleteTransaction).toHaveBeenCalledWith(mockTransactions[1]._id);

      await flushPromises();

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('deleteTransaction', mockTransactions[1]._id);

      expect($toast.clear).toHaveBeenCalled();
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

      await rows[1].trigger('click');
      await deleteButton.trigger('click');

      expect($toast.show).toHaveBeenCalled();

      expect(apiServices.deleteTransaction).toHaveBeenCalled();
      expect(apiServices.deleteTransaction).toHaveBeenCalledWith(mockTransactions[1]._id);

      await flushPromises();

      expect($toast.clear).toHaveBeenCalled();
      expect($toast.error).toHaveBeenCalled();
    });
  });
});
