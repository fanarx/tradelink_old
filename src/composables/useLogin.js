import { toRefs, reactive, computed } from '@vue/composition-api';
import firebase from '@firebase/app';

export default function() {
  let state = reactive({
    error: null,
    username: null,
    password: null,
    user: null
  });

  /**
   * have this value `isValid` get updated when the dependent properties
   * are changed in the composition function
   */
  let isValid = computed(() => {
    let { username, password } = state;
    return username !== null && username.length !== 0 && password !== null && password.length !== 0;
  });

  const loginWithEmail = () => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(state.username + '@mail.com', state.password + '12345')
      .then(
        () => {},
        error => (state.error = error)
      )
      .catch(error => {
        // Handle Errors here.
        state.error = error;
      });
  };

  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(
        () => {},
        error => (state.error = error)
      )
      .catch(error => {
        // Handle Errors here.
        state.error = error;
      });
  };

  const signupWithEmail = () => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(state.username + '@mail.com', state.password + '12345')
      .then(
        () => {},
        error => (state.error = error)
      )
      .catch(error => {
        // Handle Errors here.
        state.error = error;
      });
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(
        () => {},
        error => (state.error = error)
      )
      .catch(error => {
        // Handle Errors here.
        state.error = error;
      });
  };

  return {
    // return all of the properties from the function
    ...toRefs(state),

    // return all of the computed value to make sure we
    // get non null values for username/password from the
    // function
    isValid,

    // pass back a login and logout function to be utilized
    // by the login form
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    logout
  };
}
