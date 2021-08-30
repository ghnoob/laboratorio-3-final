import { shallowMount, flushPromises } from '@vue/test-utils';
import apiServices from '@/services/apiServices';
import Sell from '@/views/Sell.vue';
import TransactionForm from '@/components/TransactionForm.vue';

describe('Sell.vue', () => {
  const mockTransaction = {
    user_id: 'valor_introducido_login',
    action: 'sale',
    crypto_code: 'usdc',
    crypto_amount: '1.01',
    money: '170.98',
    datetime: '2021-07-19T17:50.000Z',
  };

  const mockResponse = {
    data: {
      _id: '60eb149ba4666761000216fc',
      ...mockTransaction,
    },
  };

  const $store = {
    commit: jest.fn(),
  };

  const $toast = {
    show: jest.fn(),
    error: jest.fn(),
    clear: jest.fn(),
    success: jest.fn(),
  };

  const $router = {
    push: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it('Al recibir los datos se hace un post y se actualizan los datos en el cliente', async () => {
    apiServices.postTransaction = jest.fn(() => mockResponse);

    const wrapper = shallowMount(Sell, {
      global: {
        mocks: { $store, $toast, $router },
      },
    });

    wrapper.findComponent(TransactionForm).vm.$emit('submitted', mockTransaction);

    expect($toast.show).toHaveBeenCalled();

    expect(apiServices.postTransaction).toHaveBeenCalled();
    expect(apiServices.postTransaction).toHaveBeenCalledWith(mockTransaction);

    await flushPromises();

    expect($store.commit).toHaveBeenCalled();
    expect($store.commit).toHaveBeenCalledWith('pushTransaction', mockResponse.data);

    expect($router.push).toHaveBeenCalled();
    expect($router.push).toHaveBeenCalledWith({ name: 'Transactions' });

    expect($toast.clear).toHaveBeenCalled();
    expect($toast.success).toHaveBeenCalled();
  });

  it('Si hay un error se debe mostrar un mensaje', async () => {
    apiServices.postTransaction = jest.fn(() => {
      throw new Error();
    });

    const wrapper = shallowMount(Sell, {
      global: {
        mocks: { $toast },
      },
    });

    wrapper.findComponent(TransactionForm).vm.$emit('submitted', mockTransaction);

    expect($toast.show).toHaveBeenCalled();

    expect(apiServices.postTransaction).toHaveBeenCalled();
    expect(apiServices.postTransaction).toHaveBeenCalledWith(mockTransaction);

    await flushPromises();

    expect($toast.clear).toHaveBeenCalled();
    expect($toast.error).toHaveBeenCalled();
  });
});
