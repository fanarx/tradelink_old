<template>
  <div style="background-color: #434651" class="flex justify-between h-10 px-8 fixed w-full z-50">
    <span class="flex items-center text-white h-10 font-semibold whitespace-no-wrap">
      Tradelink
    </span>
    <span v-if="user" class="flex items-center text-white cursor-pointer" @click="logout">
      Sign out
    </span>
    <div v-else class="flex items-start">
      <PlayerLogin />
    </div>
  </div>
</template>

<script>
import PlayerLogin from './PlayerLogin';
import useLogin from '../composables/useLogin';
//import { reactive } from "@vue/composition-api";
export default {
  props: ['user'],
  components: {
    PlayerLogin
  },
  setup() {
    return {
      logout: useLogin().logout
    };
  }
};
</script>
