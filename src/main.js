import Vue from 'vue';
import './assets/css/tailwind.css';
import App from './App.vue';
import VueCompositionApi from '@vue/composition-api';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

import VueApollo from 'vue-apollo';

Vue.use(VueCompositionApi);
Vue.use(VueApollo);
Vue.config.productionTip = false;

const getHeaders = () => {
  const headers = {};
  const token = window.localStorage.getItem('apollo-token');

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return headers;
};

const link = new WebSocketLink({
  uri: 'wss://tradelink.herokuapp.com/v1/graphql',
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: () => {
      return { headers: getHeaders() };
    }
  }
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    addTypename: true
  })
});

const apolloProvider = new VueApollo({
  defaultClient: client
});

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
