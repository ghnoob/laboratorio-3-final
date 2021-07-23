import { shallowMount, flushPromises } from '@vue/test-utils';
import apiServices from '@/services/apiServices';
import Edit from '@/views/Edit.vue';
import TransactionForm from '@/components/TransactionForm.vue';

describe('Edit.vue', () => {
  const $route = {
    query: { id: '60eb148da4666761000216f9' },
  };

  const mockTransaction = {
    _id: $route.query.id,
    crypto_code: 'usdc',
    crypto_amount: '1.01',
    money: '165.23',
    user_id: 'valor_introducido_login',
    action: 'purchase',
    datetime: '2021-11-07T17:50:00.000Z',
  };

  const $store = {
    commit: jest.fn(),
  };

  const $toast = {
    show: jest.fn(),
    error: jest.fn(),
    clear: jest.fn(),
  };

  const $router = {
    push: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it('Al recibir los datos se hace un patch y se actualizan los datos en el cliente', async () => {
    apiServices.patchTransaction = jest.fn();

    const wrapper = shallowMount(Edit, {
      global: {
        mocks: {
          $store,
          $toast,
          $router,
          $route,
        },
      },
    });

    await wrapper.findComponent(TransactionForm).vm.$emit('submitted', mockTransaction);

    expect($toast.show).toHaveBeenCalled();

    expect(apiServices.patchTransaction).toHaveBeenCalled();
    expect(apiServices.patchTransaction).toHaveBeenCalledWith(mockTransaction);

    await flushPromises();

    expect($store.commit).toHaveBeenCalled();
    expect($store.commit).toHaveBeenCalledWith('editTransaction', mockTransaction);

    expect($router.push).toHaveBeenCalled();
    expect($router.push).toHaveBeenCalledWith({ name: 'Transactions' });

    expect($toast.clear).toHaveBeenCalled();
  });

  it('Si hay un error se debe mostrar un mensaje', async () => {
    apiServices.postTransaction = jest.fn(() => {
      throw new Error();
    });

    const wrapper = shallowMount(Edit, {
      global: {
        mocks: { $toast, $route },
      },
    });

    await wrapper.findComponent(TransactionForm).vm.$emit('submitted', mockTransaction);

    expect($toast.show).toHaveBeenCalled();

    expect(apiServices.patchTransaction).toHaveBeenCalled();
    expect(apiServices.patchTransaction).toHaveBeenCalledWith(mockTransaction);

    await flushPromises();

    expect($toast.clear).toHaveBeenCalled();
    expect($toast.error).toHaveBeenCalled();
  });
});
