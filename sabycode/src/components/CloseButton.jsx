import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsMeetingAdmin, selectIsReadOnly, setHasUserChangedMeeting, setIsReadOnly } from "../redux/features/meeting/meetingSlice";
export default function CloseButton() {
  const dispatch = useDispatch();
  const isReadOnly = useSelector(selectIsReadOnly);
  const isMeetingAdmin = useSelector(selectIsMeetingAdmin);

    return (
      <>{ isMeetingAdmin &&
        <button className="event__log" onClick={() => {
          dispatch(setIsReadOnly(isReadOnly? false : true));
          dispatch(setHasUserChangedMeeting(true))}}>{isReadOnly? 'Открыть собрание' : 'Закрыть собрание'}</button>}
      </>
    );
  }