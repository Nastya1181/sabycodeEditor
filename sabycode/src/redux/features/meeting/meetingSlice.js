import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isReadOnly: false,
    hasUserChangedMeeting: false,
    isMeetingAdmin: false,
  }


  export const meetingSlice = createSlice({
    name: 'meeting',
    initialState,
    reducers: {
      setIsReadOnly: (state, action) => {
        state.isReadOnly = action.payload
      },
      setHasUserChangedMeeting: (state, action) => {
        state.hasUserChangedMeeting = action.payload
      },
      setIsMeetingAdmin: (state, action) => {
        state.isMeetingAdmin = action.payload
      },
    },
  })
  
  export const { setIsReadOnly, setHasUserChangedMeeting, setIsMeetingAdmin } = meetingSlice.actions;
  
  export default meetingSlice.reducer;

  export const selectIsReadOnly = (state) => state.meeting.isReadOnly;
  export const selectHasUserChangedMeeting = (state) => state.meeting.hasUserChangedMeeting;
  export const selectIsMeetingAdmin = (state) => state.meeting.isMeetingAdmin;