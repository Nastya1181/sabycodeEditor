import { createSlice } from '@reduxjs/toolkit'
import { sabycodeApi } from '../../api/sabycodeApi'

const initialState = {
    userName: localStorage.getItem('userName') || "",
    accessToken: localStorage.getItem('accessToken') || "",
    isUserConnected: sessionStorage.getItem('isUserConnected') || "",
    closedMeeting: false,
   /*  currentUsers: [], */
    color: '',
  }

  export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
      setUserName: (state, action) => {
        state.userName = action.payload
      },
      setAccessToken: (state, action) => {
        state.accessToken = action.payload
      },
      setIsUserConnected: (state, action) => {
        state.isUserConnected = action.payload
      },
      setClosedMeeting: (state, action) => {
        state.closedMeeting = action.payload
      },
     /*  setCurrentUsers: (state, action) => {
        state.currentUsers = action.payload
      }, */
      setColor: (state, action) => {
        state.color = action.payload
      },
      /* logout: () => initialState, */
    },
    extraReducers: (builder) => {
      builder.addMatcher(
        sabycodeApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.accessToken = action.payload;
        }
      );
    },
  })
  
  export const { setUserName, setAccessToken, setIsUserConnected, setClosedMeeting, /* setCurrentUsers, */ setColor } = authenticationSlice.actions;
  
  export default authenticationSlice.reducer;

  export const selectUserName = (state) => state.authentication.userName;
  export const selectAccessToken = (state) => state.authentication.accessToken;
  export const selectIsUserConnected = (state) => state.authentication.isUserConnected;
  export const selectClosedMeeting = (state) => state.authentication.closedMeeting;
  /* export const selectCurrentUsers = (state) => state.authentication.currentUsers; */
  export const selectColor = (state) => state.authentication.color;