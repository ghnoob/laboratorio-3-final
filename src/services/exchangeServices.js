import axios from 'axios';
import store from '../store';

const apiClient = axios.create({
  baseURL: 'https://criptoya.com/api',
});

export default {
  async getPrices() {
    const prices = store.state.cryptoCodes.map((item) => ({ code: item.code, exchanges: [] }));
    await Promise.all(prices.map(async (item) => {
      const response = await apiClient.get(`/${item.code}/ars`);
      item.exchanges = Object.keys(response.data).map((exchange) => (
        {
          exchange,
          bid: response.data[exchange].totalBid,
          ask: response.data[exchange].totalAsk,
        }));
    }));
    return prices;
  },
  getPriceByCrypto(cryptoCode) {
    return apiClient.get(`/satoshitango/${cryptoCode}/ars`);
  },
};
