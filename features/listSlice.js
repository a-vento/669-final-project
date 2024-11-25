import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseConfig } from "../Secrets"; 
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, doc, getDocs, addDoc, deleteDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getLoopsThunk = createAsyncThunk(
  'loops/getLoops',
  async () => {
    const initLoops = [];
    const collRef = collection(db, 'loops');
    const q = query(collRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach((docSnapshot) => {
      const loop = docSnapshot.data();
      loop.id = docSnapshot.id;
      initLoops.push(loop);
    });
    return initLoops; 
  }
);

export const addLoopThunk = createAsyncThunk(
  'loops/addLoop',
  async (loopData) => {
    const collRef = collection(db, 'loops');
    const docRef = await addDoc(collRef, loopData);
    return { ...loopData, id: docRef.id }; 
  }
);

export const removeLoopThunk = createAsyncThunk(
  'loops/deleteLoop',
  async (loop) => {
    const docRef = doc(db, 'loops', loop.id);
    await deleteDoc(docRef); 
    return loop.id;  
  }
);

const listSlice = createSlice({
  name: 'list',
  initialState: {
    loops: [], 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLoopsThunk.fulfilled, (state, action) => {
      state.loops = action.payload;  
    });

    builder.addCase(addLoopThunk.fulfilled, (state, action) => {
      state.loops.push(action.payload);  
    });

    builder.addCase(removeLoopThunk.fulfilled, (state, action) => {
      state.loops = state.loops.filter(loop => loop.id !== action.payload);
    });
  },
});

export const { } = listSlice.actions;  
export default listSlice.reducer;
