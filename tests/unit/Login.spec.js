import { shallowMount } from '@vue/test-utils';
import Login from '@/views/Login.vue';

describe('Login.vue', () => {
  const $store = {
    commit: jest.fn(),
  };

  const $router = {
    push: jest.fn(),
  };

  it('Se accede si se ingresa un usuario', async () => {
    const wrapper = shallowMount(Login, {
      global: {
        mocks: { $store, $router },
      },
    });

    expect($store.commit).toHaveBeenCalledTimes(2);
    expect($store.commit).toHaveBeenCalledWith('setUsername', '');
    expect($store.commit).toHaveBeenCalledWith('setTransactions', []);

    await wrapper.find('input').setValue('valor_introducido_login');
    await wrapper.find('form').trigger('submit.prevent');

    expect($store.commit).toHaveBeenCalledWith('setUsername', 'valor_introducido_login');

    expect($router.push).toHaveBeenCalled();
    expect($router.push).toHaveBeenCalledWith({ name: 'Home' });
  });
});
