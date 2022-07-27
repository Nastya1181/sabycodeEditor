import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUsers: [],
  }

  export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      setCurrentUsers: (state, action) => {
        state.currentUsers = action.payload
      },
      removeUser: (state, action) => {
        state.currentUsers = state.currentUsers.filter(user => user.color !== action.payload) 
      },
    },
  })
  
  export const { setCurrentUsers, removeUser } = usersSlice.actions;
  
  export default usersSlice.reducer;

  export const selectCurrentUsers = (state) => state.users.currentUsers;
