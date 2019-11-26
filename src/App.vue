<template>
  <main>
    <navbar :user="user"></navbar>

    <stock-page></stock-page>
  </main>
</template>

<script>
import { provideApollo } from './composables/useApollo';
import StockPage from './components/StockPage';
import Navbar from './components/Navbar';
import useAuth from './composables/useAuth';

export default {
  components: {
    StockPage,
    Navbar
  },
  setup(_, { root: { $apollo } }) {
    provideApollo($apollo);

    const { user, loading, error } = useAuth();

    return {
      user,
      loading,
      error
    };
  }
};
</script>
