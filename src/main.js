import Vue from 'vue';
import App from './App.vue';
import VueCompositionApi from '@vue/composition-api';
import apolloProvider from './apollo';
import './directives/clickOutside.js';
import './assets/css/tailwind.css';

Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
