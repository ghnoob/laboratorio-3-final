import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { shallowMount, flushPromises } from '@vue/test-utils';
import exchangeServices from '@/services/exchangeServices';
import TransactionForm from '@/components/TransactionForm.vue';
import mockTransactions from './mocks/mockTransactions';
import { mockPrices, newMockPrices } from './mocks/mockPrices';
import mockCryptoCodes from './mocks/mockCryptoCodes';

describe('TransactionForm.vue', () => {
  const store = createStore({
    state: {
      username: 'valor_introducido_login',
      transactions: mockTransactions,
      prices: mockPrices,
      cryptoCodes: mockCryptoCodes,
    },
    mutations: {
      setPrices(state, newPrices) {
        state.prices = newPrices;
      },
    },
  });

  const $toast = {
    show: jest.fn(),
    clear: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it('Comprar', async () => {
    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: false,
        action: 'purchase',
      },
    });

    expect(wrapper.find('#action').exists()).toBe(false);
    expect(wrapper.find('label[for="crypto-amount"]').text()).toBe('Cantidad de criptomonedas a comprar');
    expect(wrapper.find('label[for="money"]').text()).toBe('Dinero que se pagó (ARS)');

    await wrapper.find('#crypto-code').setValue('btc');
    await wrapper.find('#crypto-amount').setValue('0.01');

    const now = new Date();
    const date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    expect(wrapper.find('#date').element.value).toBe(date);
    expect(wrapper.find('#time').element.value).toBe(time);

    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted()).toHaveProperty('submitted');
    expect(wrapper.emitted('submitted')[0][0]).toEqual({
      _id: null,
      user_id: 'valor_introducido_login',
      action: 'purchase',
      crypto_code: 'btc',
      crypto_amount: '0.01',
      money: '57365.59',
      datetime: new Date(`${date} ${time}`).toISOString(),
    });
  });

  it('Vender', async () => {
    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: false,
        action: 'sale',
      },
    });

    expect(wrapper.find('#action').exists()).toBe(false);

    expect(wrapper.find('label[for="money"]').text()).toBe('Dinero que se recibió (ARS)');

    const cryptoAmountLabel = wrapper.find('label[for="crypto-amount"]');
    expect(cryptoAmountLabel.text()).toBe('Cantidad de criptomonedas a vender');

    const cryptoCode = wrapper.find('#crypto-code');
    await cryptoCode.setValue('usdc');
    expect(cryptoAmountLabel.text()).toBe('Cantidad de criptomonedas a vender (max. 0)');

    await cryptoCode.setValue('eth');
    expect(cryptoAmountLabel.text()).toBe('Cantidad de criptomonedas a vender (max. 0.07)');

    await wrapper.find('#crypto-amount').setValue('0.02');
    await wrapper.find('#date').setValue('2021-07-22');
    await wrapper.find('#time').setValue('15:03');

    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted()).toHaveProperty('submitted');
    expect(wrapper.emitted('submitted')[0][0]).toEqual({
      _id: null,
      user_id: 'valor_introducido_login',
      action: 'sale',
      crypto_code: 'eth',
      crypto_amount: '0.02',
      money: '6854.25',
      datetime: '2021-07-22T18:03:00.000Z',
    });
  });

  it('Editar venta', async () => {
    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: true,
        id: '60eb149ba4666761000216fc',
      },
    });

    await nextTick();

    const action = wrapper.find('#action');
    expect(action.exists()).toBe(true);
    expect(action.element.value).toBe('sale');

    expect(wrapper.find('#crypto-code').element.value).toBe('usdc');
    expect(wrapper.find('label[for="crypto-amount"]').text()).toBe('Cantidad de criptomonedas a vender (max. 1.01)');
    expect(wrapper.find('#crypto-amount').element.value).toBe('1.01');

    const exchange = wrapper.find('#exchange');
    expect(exchange.exists()).toBe(true);
    expect(exchange.element.value).toBe('otro');

    expect(wrapper.find('label[for="money"]').text()).toBe('Dinero que se recibió (ARS)');
    expect(wrapper.find('#money').element.value).toBe('170.98');

    expect(wrapper.find('#date').element.value).toBe('2021-11-07');
    const time = wrapper.find('#time');
    expect(time.element.value).toBe('17:50');

    await time.setValue('23:50');

    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted()).toHaveProperty('submitted');
    expect(wrapper.emitted('submitted')[0][0]).toEqual({
      _id: '60eb149ba4666761000216fc',
      user_id: 'valor_introducido_login',
      action: 'sale',
      crypto_code: 'usdc',
      crypto_amount: '1.01',
      money: '170.98',
      datetime: '2021-11-08T02:50:00.000Z',
    });
  });

  it('Editar compra: cambiar a venta - sin otras compras', async () => {
    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: true,
        id: '60eb148da4666761000216f9',
      },
    });

    await nextTick();

    const action = wrapper.find('#action');
    expect(action.exists()).toBe(true);
    expect(action.element.value).toBe('purchase');

    expect(wrapper.find('#crypto-code').element.value).toBe('usdc');
    const cryptoAmountLabel = wrapper.find('label[for="crypto-amount"]');
    expect(cryptoAmountLabel.text()).toBe('Cantidad de criptomonedas a comprar (min. 1.01)');

    await action.setValue('sale');
    expect(cryptoAmountLabel.text()).toBe('Cantidad de criptomonedas a vender (max. 0)');
  });

  it('Editar compra: cambiar a venta - hay otras compras', async () => {
    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: true,
        id: '60eb148da4666761000216f5',
      },
    });

    await nextTick();

    const action = wrapper.find('#action');
    expect(action.exists()).toBe(true);
    expect(action.element.value).toBe('purchase');

    expect(wrapper.find('#crypto-code').element.value).toBe('btc');
    const cryptoAmountLabel = wrapper.find('label[for="crypto-amount"]');
    expect(cryptoAmountLabel.text()).toBe('Cantidad de criptomonedas a comprar');

    await action.setValue('sale');
    expect(cryptoAmountLabel.text()).toBe('Cantidad de criptomonedas a vender (max. 0.01)');
  });

  it('Editar compra - Sin ventas que limiten el mínimo', async () => {
    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: true,
        id: '60eb148da4666761000216f1',
      },
    });

    await nextTick();

    expect(wrapper.find('label[for="crypto-amount"]').text()).toBe('Cantidad de criptomonedas a comprar');
  });

  it('Editar compra - Hay ventas que limitan el mínimo', async () => {
    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: true,
        id: '60eb148da4666761000216f9',
      },
    });

    await nextTick();

    expect(wrapper.find('label[for="crypto-amount"]').text()).toBe('Cantidad de criptomonedas a comprar (min. 1.01)');
  });

  it('Los exchanges funcionan correctamente', async () => {
    exchangeServices.getPrices = jest.fn(() => newMockPrices);

    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: false,
        action: 'purchase',
      },
    });

    expect(wrapper.find('#exchange').exists()).toBe(false);

    const cryptoNames = wrapper.findAll('#crypto-code option');
    expect(cryptoNames.length).toBe(4);
    expect(cryptoNames[0].text()).toBe('Bitcoin');
    expect(cryptoNames[1].text()).toBe('Dai');
    expect(cryptoNames[2].text()).toBe('Ethereum');
    expect(cryptoNames[3].text()).toBe('USD Coin');

    await wrapper.find('#crypto-code').setValue('eth');

    const exchanges = wrapper.findAll('#exchange option');
    expect(exchanges[0].text()).toBe('satoshitango - 1 ETH = 358024.52 ARS (recomendado)');
    expect(exchanges[1].text()).toBe('sesocio - 1 ETH = 359623.4 ARS');

    const exchange = wrapper.find('#exchange');
    expect(exchange.exists()).toBe(true);
    expect(exchange.element.value).toBe('358024.52');

    const cryptoAmount = wrapper.find('#crypto-amount');
    await cryptoAmount.setValue('0.07');

    const money = wrapper.find('#money');
    expect(money.element.value).toBe('25061.72');

    await exchange.setValue('359623.4');
    expect(money.element.value).toBe('25173.64');

    await wrapper.find('#crypto-code').setValue('usdc');
    expect(exchange.element.value).toBe('177.44');
    expect(money.element.value).toBe('12.42');

    await exchange.setValue('otro');
    await cryptoAmount.setValue('1');
    expect(money.element.value).toBe('12.42');
    await cryptoAmount.setValue('2');
    expect(money.element.value).toBe('12.42');

    await wrapper.find('#update').trigger('click');

    expect($toast.show).toHaveBeenCalled();

    await flushPromises();

    expect($toast.clear).toHaveBeenCalled();
    expect($toast.success).toHaveBeenCalled();

    expect(exchange.element.value).toBe('175.62');
    expect(money.element.value).toBe('351.24');
  });

  it('Si al refrescar hay un error se muestra un mensaje', async () => {
    exchangeServices.getPrices = jest.fn(() => {
      throw new Error();
    });

    const wrapper = shallowMount(TransactionForm, {
      global: {
        mocks: { $toast },
        stubs: ['router-link'],
        plugins: [store],
      },
      props: {
        edit: false,
        action: 'purchase',
      },
    });

    await wrapper.find('#update').trigger('click');

    expect($toast.show).toHaveBeenCalled();

    await flushPromises();

    expect($toast.clear).toHaveBeenCalled();
    expect($toast.error).toHaveBeenCalled();
  });
});
