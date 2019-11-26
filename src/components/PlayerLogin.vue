<template>
  <div>
    <input type="text" placeholder="username" v-model="username" />
    <input type="password" placeholder="password" v-model="password" />
    <button @click="signup" :disabled="!isValid">LOGIN</button>
    <p>{{ error }}</p>
  </div>
</template>

<script>
import useLogin from '../composables/useLogin';
export default {
  setup() {
    const loginState = useLogin();

    return {
      error: loginState.error,
      logout: loginState.logout,
      login: loginState.loginWithEmail,
      signup: loginState.signupWithEmail,
      username: loginState.username,
      password: loginState.password,
      isValid: loginState.isValid
    };
  }
};
</script>
