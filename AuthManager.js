import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './Secrets';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeToUserUpdates } from './data/Actions';


let app, auth;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}


try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  auth = getAuth(app); 
}


const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
}


const signOut = async () => {
  await fbSignOut(auth);
}


const signUp = async (displayName, email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, {displayName: displayName});
  return userCred.user;
}


const getAuthUser = () => {
  return auth.currentUser;
}

let unsubscribeFromAuthChanges = undefined;

const subscribeToAuthChanges = (navigation) => {
  if (unsubscribeFromAuthChanges) {
    unsubscribeFromAuthChanges();
  }

  unsubscribeFromAuthChanges = onAuthStateChanged(auth, (user) => {
    if (user) {
      navigation.navigate('HomeTabs');
    } else {
      navigation.navigate('Login');
    }
  })
}

export { signIn, signOut, signUp, getAuthUser, subscribeToAuthChanges };