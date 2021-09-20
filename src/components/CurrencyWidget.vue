<template>
  <div
    class="coinmarketcap-currency-widget"
    :data-currencyid="currencyId"
    data-base="ARS"
    data-secondary="USD"
    data-ticker="true"
    data-rank="false"
    data-marketcap="true"
    data-volume="true"
    data-statsticker="true"
    data-stats="USD">
  </div>
</template>

<script>
export default {
  name: 'CurrencyWidget',
  props: {
    currencyId: {
      type: String,
      required: true,
    },
  },
};
</script>
