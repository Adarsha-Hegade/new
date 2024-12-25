import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../types';

interface TaskState {
  items: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setTaskLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTaskError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setTasks, addTask, updateTask, setTaskLoading, setTaskError } = taskSlice.actions;
export default taskSlice.reducer;