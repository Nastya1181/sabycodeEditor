import { createSlice } from '@reduxjs/toolkit'
import { sabycodeApi } from '../../api/sabycodeApi'

const initialState = {
    userName: localStorage.getItem('userName') || "",
    accessToken: localStorage.getItem('accessToken') || "",
  /*   isReadOnly: false,
    hasUserChangedMeeting: false, */
    color: '',
/*     isMeetingAdmin: false, */
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
      /* setIsReadOnly: (state, action) => {
        state.isReadOnly = action.payload
      }, */
      setColor: (state, action) => {
        state.color = action.payload
      },
     /*  setHasUserChangedMeeting: (state, action) => {
        state.hasUserChangedMeeting = action.payload
      },
      setIsMeetingAdmin: (state, action) => {
        state.isMeetingAdmin = action.payload
      }, */
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
  
  export const { setUserName, setAccessToken,/*  setIsReadOnly,  setHasUserChangedMeeting, */ setColor/* , setIsMeetingAdmin */ } = authenticationSlice.actions;
  
  export default authenticationSlice.reducer;

  export const selectUserName = (state) => state.authentication.userName;
  export const selectAccessToken = (state) => state.authentication.accessToken;
  /* export const selectIsReadOnly = (state) => state.authentication.isReadOnly; */
  /* export const selectHasUserChangedMeeting = (state) => state.authentication.hasUserChangedMeeting; */
  export const selectColor = (state) => state.authentication.color;
  /* export const selectIsMeetingAdmin = (state) => state.authentication.isMeetingAdmin; */