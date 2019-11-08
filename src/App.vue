<template>
  <main>
    <hello-world></hello-world>
  </main>
</template>

<script>
import { provideApollo } from "./composables/useApollo";
import HelloWorld from "./components/HelloWorld";
export default {
  components: {
    HelloWorld
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