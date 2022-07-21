import React from "react";
import { useDispatch } from "react-redux";
import { setClosedMeeting } from "../redux/features/authentication/authenticationSlice";
export default function CloseButton() {
  const dispatch = useDispatch();
    return (
      <>
        <button className="event__log" onClick={() => {dispatch(setClosedMeeting(true))}}>Закрыть собрание</button>
      </>
    );
  }