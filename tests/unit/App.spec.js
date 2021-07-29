import { shallowMount } from '@vue/test-utils';
import exchangeServices from '@/services/exchangeServices';
import App from '@/App.vue';

describe('App.vue', () => {
  beforeAll(() => {
    exchangeServices.getPrices = jest.fn(() => []);
  });

  describe('Sin haber ingresado', () => {
    const $store = {
      state: { transactions: [], username: '' },
      commit: jest.fn(),
    };

    it('Si se está en la pantalla de login no se muestra ningún link', () => {
      const $route = { name: 'Login' };
      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store, $route },
          stubs: ['router-link', 'router-view'],
        },
      });

      expect(wrapper.find('p .username').exists()).toBe(false);

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('setPrices', []);

      expect(wrapper.find('#nav').exists()).toBe(false);
    });

    it('Si no se está en la pantalla de login se muestra un link a esta', () => {
      const $route = { name: 'NotFound' };

      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store, $route },
          stubs: ['router-link', 'router-view'],
        },
      });

      expect(wrapper.find('p .username').exists()).toBe(false);

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('setPrices', []);

      expect(wrapper.findAll('.link').length).toBe(1);
    });
  });

  describe('Habiendo ingresado', () => {
    it('Se muestran los links para navegar libremente por la página', () => {
      const $store = {
        state: { transactions: [], username: 'test' },
        commit: jest.fn(),
      };

      const wrapper = shallowMount(App, {
        global: {
          mocks: { $store },
          stubs: ['router-link', 'router-view'],
        },
      });

      const username = wrapper.find('p.username');
      expect(username.exists()).toBe(true);
      expect(username.text()).toBe('test');

      expect($store.commit).toHaveBeenCalled();
      expect($store.commit).toHaveBeenCalledWith('setPrices', []);

      expect(wrapper.findAll('.link').length).toBe(5);
    });
  });
});
