<template>
  <h1>Comprar</h1>
  <transaction-form :edit="false" action="purchase" @submitted="buy" />
</template>

<script>
import TransactionForm from '@/components/TransactionForm.vue';
import apiServices from '@/services/apiServices.js';

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
    async buy(transaction) {
      const response = await apiServices.postTransaction(transaction);
      this.transaction = transaction;
      this.transaction._id = response.data._id;
      this.$store.commit('pushTransaction', this.transaction);
      this.$router.push({ name: 'Transactions' });
    },
  },
};
</script>
