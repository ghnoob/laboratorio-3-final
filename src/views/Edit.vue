<template>
  <h1>Editar</h1>
  <transaction-form :edit="true" :id="id" @submitted="edit" />
</template>

<script>
import TransactionForm from '@/components/TransactionForm.vue';
import apiServices from '@/services/apiServices';

export default {
  components: {
    TransactionForm,
  },
  methods: {
    async edit(transaction) {
      await apiServices.patchTransaction(transaction._id, transaction);
      this.$store.commit('editTransaction', transaction);
      this.$router.push({ name: 'Transactions' });
    },
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
};
</script>
