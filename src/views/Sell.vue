<template>
  <h1>Vender</h1>
  <transaction-form :edit="false" action="sale" @submitted="sell" />
</template>

<script>
import TransactionForm from '../components/TransactionForm.vue';
import apiServices from '../services/apiServices';

export default {
  components: {
    TransactionForm,
  },
  data() {
    return {
      transaction: {},
    };
  },
  methods: {
    async sell(transaction) {
      try {
        this.$toast.show('Vendiendo...', { duration: false });
        const response = await apiServices.postTransaction(transaction);
        this.transaction = transaction;
        this.transaction._id = response.data._id;
        this.$store.commit('pushTransaction', this.transaction);
        this.$router.push({ name: 'Transactions' });
        this.$toast.clear();
        this.$toast.success('Vendido');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
      }
    },
  },
};
</script>
