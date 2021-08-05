<template>
  <h1>Editar</h1>
  <transaction-form :edit="true" :id="id" @submitted="edit" />
</template>

<script>
import TransactionForm from '../components/TransactionForm.vue';
import apiServices from '../services/apiServices';

export default {
  components: {
    TransactionForm,
  },
  methods: {
    async edit(transaction) {
      try {
        this.$toast.show('Modificando...', { duration: false });
        await apiServices.patchTransaction(transaction);
        this.$store.commit('editTransaction', transaction);
        this.$router.push({ name: 'Transactions' });
        this.$toast.clear();
        this.$toast.success('Modificado');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
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
