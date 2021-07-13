<template>
  <h1>Comprar</h1>
  <transaction-form :edit="false" action="purchase" @submitted="buy" />
</template>

<script>
import TransactionForm from '@/components/TransactionForm.vue';

export default {
  components: {
    TransactionForm,
  },
  methods: {
    buy(transaction) {
      this.$store.commit('pushTransaction', transaction);
      this.$router.push({ name: 'Transactions' });
    },
  },
};
</script>
