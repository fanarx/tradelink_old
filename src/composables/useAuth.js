import { toRefs, reactive } from '@vue/composition-api';
import { useApollo } from './useApollo';
import gql from 'graphql-tag';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

// initialize firebase, this is directly from the firebase documentation
// regarding getting started for the web
if (firebase.apps.length === 0) {
  const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_apiKey,
    authDomain: process.env.VUE_APP_FIREBASE_authDomain,
    databaseURL: process.env.VUE_APP_FIREBASE_databaseURL,
    projectId: process.env.VUE_APP_FIREBASE_projectId,
    storageBucket: process.env.VUE_APP_FIREBASE_storageBucket,
    messagingSenderId: process.env.VUE_APP_FIREBASE_messagingSenderId,
    appId: process.env.VUE_APP_FIREBASE_appId
  };
  firebase.initializeApp(firebaseConfig);
}

const INSERT_USER = gql`
  mutation insert_user($id: String!, $name: String!) {
    insert_user(objects: { id: $id, name: $name }) {
      affected_rows
      returning {
        id
        name
      }
    }
  }
`;

export default function() {
  // our reactive properties...
  let state = reactive({
    user: null,
    loading: true,
    error: null
  });

  // make the firebase call to listen for change in auth state,
  // we have set initial loading status to true so nothing happens on UI
  // side until loading is set to false
  //let callback = null;
  //let metadataRef = null;
  const apollo = useApollo();

  firebase.auth().onAuthStateChanged(async user => {
    console.log('user from useAuth', user);
    // Remove previous listener.
    // if (callback) {
    //   console.log('TCL: remove callback', callback);
    //   metadataRef.off('value', callback);
    // }
    if (user) {
      const token = await user.getIdToken();
      const idTokenResult = await user.getIdTokenResult();
      const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims'];

      if (hasuraClaim) {
        state.user = user;
        localStorage.setItem('token', token);
      } else {
        // Check if refresh is required.

        const metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');

        const callback = async () => {
          console.log('TCL: metadataRef callback', metadataRef);
          // Force refresh to pick up the latest custom claims changes.
          const token = await user.getIdToken(true);
          state.user = user;
          localStorage.setItem('token', token);
          const variables = {
            id: user.uid,
            name: user.email.split('@')[0]
          };

          apollo
            .mutate({
              mutation: INSERT_USER,
              variables
            })
            .catch(error => {
              console.error('mutation error:', error);
            });
        };
        metadataRef.once('value', callback);
      }
    } else {
      state.user = null;
      localStorage.removeItem('token');
    }

    state.loading = false;
  });
  // return all of the properties from the function
  return {
    ...toRefs(state)
  };
}
