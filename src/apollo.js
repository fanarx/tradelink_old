import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
const getHeaders = () => {
  const headers = {
    //'x-hasura-admin-secret': process.env.VUE_APP_X_HASURA_ADMIN_SECRET
    //'x-hasura-role': 'anonymous'
  };
  const token = window.localStorage.getItem('token');

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return headers;
};

const link = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPH_QL_URI,
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

export default client;
