const ADD_USER = 'ADD_USER';
const LOAD_USERS = 'LOAD_USERS';
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';

const initialState = {
  users: [],       
  currentUser: {},  
  currentChat: null,  
};

const loadUsers = (state, payload) => {
  return {
    ...state, 
    users: [...payload.users],
  };
};

const addUser = (state, payload) => {
  return {
    ...state, 
    users: state.users.concat({ ...payload.user }), 
  };
};

const setCurrentUser = (state, payload) => {
  return {
    ...state, 
    currentUser: payload.currentUser, 
  };
};

const setCurrentChat = (state, payload) => {
  return {
    ...state, 
    currentChat: payload.currentChat, 
  };
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS:
      return loadUsers(state, action.payload);
    case ADD_USER:
      return addUser(state, action.payload);
    case SET_CURRENT_USER:
      return setCurrentUser(state, action.payload);
    case SET_CURRENT_CHAT:
      return setCurrentChat(state, action.payload);
    case 'ADD_MESSAGE':
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          messages: [...state.currentChat.messages, action.payload], 
        },
      };
      
    case 'SET_MESSAGES':
      if (state.currentChat.id === action.payload.chatId) {
        return {
          ...state,
          currentChat: {
            ...state.currentChat,
            messages: action.payload.messages,
          },
        };
      }
      return state;
    case 'SET_CURRENT_CHAT':
      return {
        ...state,
        currentChat: action.payload, 
    };
    default:
      return state;
  }
};

export { 
  rootReducer, 
  ADD_USER, 
  LOAD_USERS, 
  SET_CURRENT_USER, 
  SET_CURRENT_CHAT 
};
