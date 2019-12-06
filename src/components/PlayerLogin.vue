<template>
  <div>
    <div v-click-outside="closeDropDown" class="flex flex-col overflow-hidden w-48 z-10">
      <div @click.stop="userState.isDropdownOpen = !userState.isDropdownOpen" class="flex h-10 items-center">
        <span class="w-4/5 cursor-pointer pr-3 text-white text-right pl-2">
          {{ userState.selectedUser ? userState.selectedUser.name : 'Log in' }}
        </span>
        <span :class="userState.isDropdownOpen ? 'arrow-up' : 'arrow-down'" />
      </div>
      <div v-if="userState.isDropdownOpen">
        <ul
          class="flex flex-col items-start absolute bg-white border
      border-gray-400 w-48 border-t-0 h-30 overflow-auto overflow-x-hidden"
        >
          <li
            v-for="user in userState.users"
            :key="user.id"
            class="flex w-full pl-2 py-4 h-12 cursor-pointer hover:bg-teal-600"
            @click.stop="handleUserSelect(user)"
          >
            <span class="w-1/5 inline-block">
              <icon-base v-if="user.is_confirmed" class="w-6 h-6" icon-name="confirmed"><icon-confirmed /></icon-base>
            </span>

            <span class="w-4/5">{{ user.name }}</span>
          </li>
        </ul>
      </div>
      <div
        class=" flex flex-col bg-white border border-gray-400 z-10 p-4"
        v-if="!userState.isDropdownOpen && userState.selectedUser"
      >
        <!-- <input class="border py-2 px-3 text-grey-darkest" type="text" placeholder="username" v-model="username" /> -->
        <input
          class="border py-2 px-1 text-grey-darkest mb-1"
          type="password"
          placeholder="Password"
          v-model="password"
        />
        <input
          v-if="!userState.selectedUser.is_confirmed"
          class="border py-2 px-1 text-grey-darkest"
          type="password"
          placeholder="Confirm password"
          v-model="userState.confirmPassword.text"
        />
        <p v-if="!doesPasswordsMatch" class="text-red-500">{{ userState.confirmPassword.error }}</p>
        <button
          v-if="!userState.selectedUser.is_confirmed"
          class="block bg-teal-500 hover:bg-teal-700 text-white uppercase py-2
        px-8 m-3 mx-auto rounded"
          @click="signUp"
          :disabled="!doesPasswordsMatch || !isValid"
        >
          Sign up
        </button>
        <button
          v-else
          class="block bg-teal-500 hover:bg-teal-700 text-white uppercase py-2
        px-8 m-3 mx-auto rounded"
          @click="logIn"
          :disabled="!isValid"
        >
          Login
        </button>
        <p class="text-red-500">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from '@vue/composition-api';
import gql from 'graphql-tag';
import useLogin from '../composables/useLogin';
import { useApollo } from '../composables/useApollo';
import IconBase from '../components/IconBase';
import IconConfirmed from '../components/icons/IconConfirmed';
export default {
  components: {
    IconBase,
    IconConfirmed
  },
  setup() {
    const apollo = useApollo();

    const authState = useLogin();
    const userState = reactive({
      users: [],
      isDropdownOpen: false,
      selectedUser: null,
      confirmPassword: {
        text: null,
        error: null
      }
    });

    function closeDropDown() {
      userState.isDropdownOpen = false;
      userState.selectedUser = null;
      userState.confirmPassword = {
        text: null,
        error: null
      };
      authState.username.value = null;
      authState.password.value = null;
    }

    function handleUserSelect(user) {
      userState.selectedUser = user;
      userState.isDropdownOpen = false;
      authState.username.value = user.name;
    }

    function signUp() {
      authState.username.value = authState.username.value + '@mail.com';
      authState.signupWithEmail();
    }

    function logIn() {
      authState.username.value = authState.username.value + '@mail.com';
      authState.loginWithEmail();
    }

    const doesPasswordsMatch = computed(() => {
      const isMatch = userState.confirmPassword.text === authState.password.value;
      if (!isMatch && userState.confirmPassword.text !== null) {
        userState.confirmPassword.error = 'Passwords do not match';
        if (userState.confirmPassword.text === '') {
          userState.confirmPassword.error = null;
        }
      }
      return isMatch;
    });

    onMounted(() => {
      const GET_USERS = gql`
        query getUsers {
          user {
            name
            is_confirmed
          }
        }
      `;
      apollo
        .query({
          query: GET_USERS
        })
        .then(({ data }) => {
          userState.users = data.user;
        })
        .catch(err => console.log('apollo error', err));
    });

    return {
      closeDropDown,
      handleUserSelect,
      doesPasswordsMatch,
      userState,
      signUp,
      logIn,
      error: authState.error,
      logout: authState.logout,
      username: authState.username,
      password: authState.password,
      isValid: authState.isValid
    };
  }
};
</script>
<style scoped>
button:disabled,
button[disabled] {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}
</style>
