import { shallowMount, flushPromises } from '@vue/test-utils';
import apiServices from '@/services/apiServices';
import Login from '@/views/Login.vue';

describe('Login.vue', () => {
  const $store = {
    commit: jest.fn(),
  };

  const $toast = {
    show: jest.fn(),
    clear: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  };

  const $router = {
    push: jest.fn(),
  };

  it('Se accede si se ingresa un usuario', async () => {
    apiServices.getTransactions = jest.fn(() => ({ data: ['test'] }));

    const wrapper = shallowMount(Login, {
      global: {
        mocks: { $store, $toast, $router },
      },
    });

    expect($store.commit).toHaveBeenCalledTimes(2);
    expect($store.commit).toHaveBeenCalledWith('setUsername', '');
    expect($store.commit).toHaveBeenCalledWith('setTransactions', []);

    await wrapper.find('input').setValue('valor_introducido_login');
    await wrapper.find('form').trigger('submit.prevent');

    expect($store.commit).toHaveBeenCalledWith('setUsername', 'valor_introducido_login');

    expect($toast.show).toHaveBeenCalled();
    expect(apiServices.getTransactions).toHaveBeenCalledTimes(1);
    expect(apiServices.getTransactions).toHaveBeenCalledWith('valor_introducido_login');

    await flushPromises();
    expect($toast.clear).toHaveBeenCalled();
    expect($store.commit).toHaveBeenCalledWith('setTransactions', ['test']);
    expect($store.commit).toHaveBeenCalledTimes(4);
    expect($toast.success).toHaveBeenCalled();

    expect($router.push).toHaveBeenCalled();
    expect($router.push).toHaveBeenCalledWith({ name: 'Home' });
  });

  it('Si hay un error muestra un mensaje', async () => {
    apiServices.getTransactions = jest.fn(() => {
      throw new Error();
    });

    const wrapper = shallowMount(Login, {
      attachTo: document.body,
      global: {
        mocks: { $store, $toast, $router },
      },
    });

    await wrapper.find('input').setValue('valor_introducido_login');
    await wrapper.find('button').trigger('click');

    expect($toast.show).toHaveBeenCalled();
    expect(apiServices.getTransactions).toHaveBeenCalledTimes(1);
    expect(apiServices.getTransactions).toHaveBeenCalledWith('valor_introducido_login');

    await flushPromises();
    expect($toast.clear).toHaveBeenCalled();
    expect($toast.error).toHaveBeenCalled();

    expect($router.push).toHaveBeenCalled();
    expect($router.push).toHaveBeenCalledWith({ name: 'Home' });
  });
});
