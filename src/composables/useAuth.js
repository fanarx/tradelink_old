import { toRefs, reactive } from '@vue/composition-api';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { GET_USERS } from '../queries';
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

const UPDATE_USER = gql`
  mutation update_user($id: String!, $name: String!, $is_confirmed: Boolean) {
    update_user(where: { name: { _eq: $name } }, _set: { id: $id, is_confirmed: $is_confirmed }) {
      returning {
        id
        is_confirmed
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

  const { mutate: updateUser, onError } = useMutation(UPDATE_USER, {
    update: (cache, { data: { update_user } }) => {
      const cacheData = cache.readQuery({ query: GET_USERS });
      const updateUser = update_user.returning[0];
      const index = cacheData.user.findIndex(user => user.name == updateUser.name);
      if (index > -1) {
        cacheData.user[index].id = updateUser.id;
        cacheData.user[index].is_confirmed = updateUser.is_confirmed;
      }
      cache.writeQuery({ query: GET_USERS, data: cacheData });
    }
  });

  onError(error => {
    console.error('mutation error', error);
  });

  // make the firebase call to listen for change in auth state,
  // we have set initial loading status to true so nothing happens on UI
  // side until loading is set to false
  //let callback = null;
  //let metadataRef = null;

  firebase.auth().onAuthStateChanged(async user => {
    console.log('user from useAuth', user);
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
            name: user.email.split('@')[0],
            is_confirmed: true
          };

          updateUser(variables);
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
