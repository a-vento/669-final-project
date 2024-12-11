import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseConfig } from "../Secrets"; 
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

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
      loop.notes = Array.isArray(loop.notes) ? loop.notes : [];

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


export const updateLoopThunk = createAsyncThunk(
  'loops/updateLoop',
  async (loop) => {
    const docRef = doc(db, 'loops', loop.id);
    await updateDoc(docRef, {
      name: loop.name,
      amount: loop.amount,
      date: loop.date,
      course: loop.course,
      notes: loop.notes 
    });
    return loop;
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

    builder.addCase(updateLoopThunk.fulfilled, (state, action) => {
      const updatedLoop = action.payload;
      const index = state.loops.findIndex(loop => loop.id === updatedLoop.id);
      if (index !== -1) {
        state.loops[index] = updatedLoop;
      }
    });
  },
});

export const { } = listSlice.actions;  
export default listSlice.reducer;
