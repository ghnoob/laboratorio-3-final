import { shallowMount, flushPromises } from '@vue/test-utils';
import exchangeServices from '@/services/exchangeServices';
import App from '@/App.vue';

describe('App.vue', () => {
  const $store = {
    state: {
      transactions: [],
      username: '',
      prices: [],
    },
    commit: jest.fn(),
  };

  const $toast = {
    show: jest.fn(),
    error: jest.fn(),
    clear: jest.fn(),
    success: jest.fn(),
  };

  describe('Sin haber ingresado', () => {
    it('Si se está en la pantalla de login no se muestra ningún link', async () => {
      exchangeServices.getPrices = jest.fn(() => []);
      const $route = { name: 'Login' };
      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store, $route, $toast },
          stubs: ['router-link', 'router-view'],
        },
      });

      expect(wrapper.find('p .username').exists()).toBe(false);

      expect($toast.show).toHaveBeenCalled();

      expect(exchangeServices.getPrices).toHaveBeenCalled();

      await flushPromises();

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('setPrices', []);

      expect($toast.clear).toHaveBeenCalled();
      expect($toast.success).toHaveBeenCalled();

      expect(wrapper.find('#nav').exists()).toBe(false);
    });

    it('Si no se está en la pantalla de login se muestra un link a esta', async () => {
      exchangeServices.getPrices = jest.fn(() => {
        throw new Error();
      });
      const $route = { name: 'NotFound' };

      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store, $route, $toast },
          stubs: ['router-link', 'router-view'],
        },
      });

      expect(wrapper.find('p .username').exists()).toBe(false);
      expect(wrapper.findAll('.link').length).toBe(1);

      expect($toast.show).toHaveBeenCalled();

      expect(exchangeServices.getPrices).toHaveBeenCalled();

      await flushPromises();

      expect($toast.clear).toHaveBeenCalled();
      expect($toast.error).toHaveBeenCalled();
    });
  });

  describe('Habiendo ingresado', () => {
    beforeAll(() => {
      $store.state.username = 'test';
    });

    it('Se muestran los links para navegar libremente por la página', () => {
      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store, $toast },
          stubs: ['router-link', 'router-view'],
        },
      });

      const username = wrapper.find('p.username');
      expect(username.exists()).toBe(true);
      expect(username.text()).toBe('test');

      expect(wrapper.findAll('.link').length).toBe(5);
    });
  });
});
