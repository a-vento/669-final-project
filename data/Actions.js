import { initializeApp } from 'firebase/app';
import { setDoc, addDoc, doc, getFirestore, 
  getDocs, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; 

import { firebaseConfig } from '../Secrets';
import { ADD_USER, LOAD_USERS, SET_CURRENT_CHAT } from './Reducer';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let usersSnapshotUnsub = undefined;
let chatSnapshotUnsub = undefined;

const subscribeToUserUpdates = () => {
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

const addUser = (user) => {
  return async (dispatch) => {
    const userToAdd = {
      displayName: user.displayName,
      email: user.email,
      key: user.uid
    };
    await setDoc(doc(db, 'users', user.uid), userToAdd);
  }
}

const addOrSelectChat = (user1id, user2id) => {
  return async (dispatch) => {
    const chatQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user1id)
    );

    const results = await getDocs(chatQuery);
    let chatSnap = results.docs?.find((elem) => elem.data().participants.includes(user2id));
    let theChat;

    if (!chatSnap) {
      theChat = { participants: [user1id, user2id] };
      const chatRef = await addDoc(collection(db, 'chats'), theChat);
      theChat.id = chatRef.id;
    } else {
      theChat = { ...chatSnap.data(), id: chatSnap.id };
    }

    dispatch({
      type: SET_CURRENT_CHAT,
      payload: { currentChat: theChat },
    });

    const q = query(
      collection(db, 'chats', theChat.id, 'messages'),
      orderBy('timestamp', 'asc')
    );
    chatSnapshotUnsub = onSnapshot(q, (messagesSnapshot) => {
      const messages = messagesSnapshot.docs.map((msgSnap) => ({
        ...msgSnap.data(),
        timestamp: msgSnap.data().timestamp.seconds,
        id: msgSnap.id,
      }));
      dispatch({
        type: SET_CURRENT_CHAT,
        payload: {
          currentChat: {
            ...theChat,
            messages,
          },
        },
      });
    });
  };
};

const addCurrentChatMessage = (message) => {
  return async (dispatch, getState) => {
    const currentChat = getState().reducer.currentChat;

    if (!currentChat || !currentChat.id) {
      console.error("No current chat available or invalid chat ID:", currentChat);
      return;
    }

    if (!message || !message.author || !message.message || !message.timestamp) {
      console.error("Message data is incomplete:", message);
      return;
    }

    const timestamp = message.timestamp instanceof Timestamp ? message.timestamp : Timestamp.fromDate(new Date(message.timestamp));
    const messageCollection = collection(db, 'chats', currentChat.id, 'messages');

    try {
      await addDoc(messageCollection, {
        ...message,
        timestamp, 
      });
      dispatch({
        type: 'SET_MESSAGES',
        payload: {
          chatId: currentChat.id,
          messages: [...currentChat.messages, message], 
        }
      });

    } catch (error) {
      console.error("Error adding message to Firestore:", error);
    }
  };
};

export const fetchChatMessages = (chatId) => {
  return async (dispatch) => {
    try {
      const messageCollection = collection(db, 'chats', chatId, 'messages');
      const querySnapshot = await getDocs(messageCollection);
      const messages = querySnapshot.docs.map(doc => {
        const messageData = doc.data();

        if (messageData.timestamp && messageData.timestamp.toDate) {
          messageData.timestamp = messageData.timestamp.toDate().toISOString(); 
        } else {
          console.warn("Timestamp is missing or not a Firestore Timestamp:", messageData);
        }

        return {
          id: doc.id,
          ...messageData,
        };
      });

      dispatch({
        type: 'SET_MESSAGES',
        payload: {
          chatId,
          messages,
        },
      });
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };
};

const unsubscribeFromUsers = () => {
  if (usersSnapshotUnsub) {
    usersSnapshotUnsub();
    usersSnapshotUnsub = undefined;
  }
}

const unsubscribeFromChat = () => {
  if (chatSnapshotUnsub) {
    chatSnapshotUnsub();
    chatSnapshotUnsub = undefined;
  }
}

export { 
  addUser, 
  subscribeToUserUpdates, 
  addOrSelectChat, 
  addCurrentChatMessage,
  unsubscribeFromChat,
  unsubscribeFromUsers
};
