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
      try {
        this.$toast.show('Modificando...');
        await apiServices.patchTransaction(transaction._id, transaction);
        this.$store.commit('editTransaction', transaction);
        this.$router.push({ name: 'Transactions' });
        this.$toast.clear();
      } catch {
        this.$toast.clear();
        this.$toast.error('Error', { duration: 2000 });
      }
    },
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
};
</script>
