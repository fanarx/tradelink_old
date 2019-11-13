<template>
  <stock-page></stock-page>
</template>

<script>
import { provideApollo } from "./composables/useApollo";
import StockPage from "./components/StockPage";
export default {
  components: {
    StockPage
  },
  setup(
    _,
    {
      root: { $apollo }
    }
  ) {
    provideApollo($apollo);

    return {};
  }
};
</script>

<style>
</style>