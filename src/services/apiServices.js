import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
  headers: { 'x-apikey': '60eb09146661365596af552f' },
});

export default {
  getTransactions(user) {
    return apiClient.get(`/transactions?q={"user_id":"${user}"}`);
  },
  postTransaction(transaction) {
    return apiClient.post('/transactions', transaction);
  },
  patchTransaction(id, transaction) {
    return apiClient.patch(`/transactions/${id}`, transaction);
  },
  deleteTransaction(id) {
    return apiClient.delete(`/transactions/${id}`);
  },
};
