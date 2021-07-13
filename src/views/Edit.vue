<template>
  <h1>Editar</h1>
  <transaction-form :edit="true" :id="id" @submitted="edit" />
</template>

<script>
import TransactionForm from '@/components/TransactionForm.vue';

export default {
  components: {
    TransactionForm,
  },
  methods: {
    edit(transaction) {
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
