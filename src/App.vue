<template>
  <main>
    <hello-world></hello-world>
    <div class="bg-red-500 p-3">
      Tailwind Test
    </div>
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