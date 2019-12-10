import Vue from 'vue';
import App from './App.vue';
import VueCompositionApi from '@vue/composition-api';
import { provide } from '@vue/composition-api';
import { ApolloClients } from '@vue/apollo-composable';
import apolloClient from './apollo';

import './directives/clickOutside.js';
import './assets/css/tailwind.css';

Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

new Vue({
  setup() {
    provide(ApolloClients, {
      default: apolloClient
    });
  },
  render: h => h(App)
}).$mount('#app');
