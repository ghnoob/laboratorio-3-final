<template>
  <h1>Comprar</h1>
  <transaction-form :edit="false" action="purchase" @submitted="buy" />
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
    async buy(transaction) {
      try {
        this.$toast.show('Comprando...', { duration: false });
        const response = await apiServices.postTransaction(transaction);
        this.transaction = transaction;
        this.transaction._id = response.data._id;
        this.$store.commit('pushTransaction', this.transaction);
        this.$router.push({ name: 'Transactions' });
        this.$toast.clear();
        this.$toast.success('Comprado');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
      }
    },
  },
};
</script>
