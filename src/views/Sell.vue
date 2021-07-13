<template>
  <h1>Vender</h1>
  <transaction-form :edit="false" action="sale" @submitted="sell" />
</template>

<script>
import TransactionForm from '@/components/TransactionForm.vue';

export default {
  components: {
    TransactionForm,
  },
  methods: {
    sell(transaction) {
      this.$store.commit('pushTransaction', transaction);
      this.$router.push({ name: 'Transactions' });
    },
  },
};
</script>
