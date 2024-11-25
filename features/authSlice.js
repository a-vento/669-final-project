import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../Secrets';
import { getAuth, updateProfile } from 'firebase/auth';
import { ADD_USER, LOAD_USERS, SET_CURRENT_CHAT } from '../data/Reducer';

import { setDoc, addDoc, doc, getFirestore, 
  getDocs, collection, query, where, onSnapshot } 
  from 'firebase/firestore';

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);

let usersSnapshotUnsub = undefined;
let chatSnapshotUnsub = undefined;

export const subscribeToUserUpdates = () => {
  if (usersSnapshotUnsub) {
    usersSnapshotUnsub();
  }
  return (dispatch) => {
    usersSnapshotUnsub =  onSnapshot(collection(db, 'users'), usersSnapshot => {
      const updatedUsers = usersSnapshot.docs.map(uSnap => {
        return uSnap.data(); 
      });
      dispatch({
        type: LOAD_USERS,
        payload: {
          users: updatedUsers
        }
      });
    });
  }
}

export const addUser = createAsyncThunk(
  'auth/addUser',
  async (user) => {
    const userToAdd = {
      displayName: user.displayName,
      email: user.email,
      key: user.uid
    };
    try {
      await setDoc(doc(db, 'users', user.uid), userToAdd);
    } catch (e) {
      console.log('Error adding user', e);
    }
    return userToAdd;
  }
);

export const updateUserData = createAsyncThunk(
  'auth/updateUserData',
  async ({ displayName, rank, course, uid }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { rank, course, displayName }, { merge: true });
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName });
      }

      return { displayName, rank, course }; 
    } catch (error) {
      console.error('Error updating user data:', error);
      return rejectWithValue(error.message);
    }
  }
);
const initialState = {
  users: [],
  user: null,
  error: null,
  status: 'idle',
  otherUserId: null, 
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; 
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setOtherUserId: (state, action) => {
      state.otherUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LOAD_USERS, (state, action) => {
      state.users = action.payload.users; 
    });
  },
});



export const addOrSelectChat = createAsyncThunk(
  'chat/addOrSelect',
  async({user1id, user2id}) => {
    try {
      const chatQuery = query(collection(db, 'chats'),
        where('participants', 'array-contains', user1id),
      );
      const results = await getDocs(chatQuery);
      const chatSnap = results.docs?.find(
        elem => elem.data().participants.includes(user2id),
      );
      let theChat;
      if (!chatSnap) { 
        theChat = {
          participants: [user1id, user2id],
        }
        const chatRef = await addDoc(collection(db, 'chats'), theChat);
        theChat.id = chatRef.id
      } else { 
        theChat = {
          ...chatSnap.data(),
          id: chatSnap.id
        }
      }
    }
    catch(e) {
      console.log('error finding chats', e)
    }

  }
)
export const { setUser, setUsers, setOtherUserId } = authSlice.actions;
export const { setCurrentUser } = authSlice.actions;
export const { loadUsers } = authSlice.actions;
export default authSlice.reducer;
