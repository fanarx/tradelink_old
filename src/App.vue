<template>
  <main>
    <div v-if="user">
      <div>
        <h2>Welcome, {{user.displayName}}</h2>
        <button @click="logout">Sign out</button>
      </div>
    </div>
    <div v-else>
      <button @click="login">Sign in with Google</button>
    </div>
    <stock-page></stock-page>
  </main>
</template>

<script>
import { provideApollo } from "./composables/useApollo";
import StockPage from "./components/StockPage";
import { computed } from "@vue/composition-api";
import useAuth from "./composables/useAuth";
import useLogin from "./composables/useLogin";

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

    const { user, loading, error } = useAuth();
    const loginState = useLogin();
    return {
      user,
      loading,
      error: computed(() => (loginState.error || error).value),
      logout: loginState.logout,
      login: loginState.loginWithGoogle
    };
  }
};
</script>

<style>
</style>