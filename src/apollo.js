import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import { split, Observable } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import firebase from '@firebase/app';

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPH_QL_URI
});

const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPH_QL_URI_WS,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers = {} }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {})
    }
  };
});

const promiseToObservable = promise =>
  new Observable(subscriber => {
    promise.then(
      value => {
        if (subscriber.closed) return;
        subscriber.next(value);
        subscriber.complete();
      },
      err => subscriber.error(err)
    );
    return subscriber; // this line can removed, as per next comment
  });

const errorLink = onError(({ graphQLErrors, forward, operation }) => {
  if (graphQLErrors[0].extensions.code === 'invalid-jwt') {
    //const token = await firebase.auth().currentUser.getIdToken(true);
    //localStorage.setItem('token', token);
    //console.log('errorLink -> token', token);
    //return forward(operation);
    return promiseToObservable(
      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(token => localStorage.setItem('token', token))
    ).flatMap(() => forward(operation));
  }
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(link)),
  cache: new InMemoryCache({
    addTypename: true
  })
});

export default client;
