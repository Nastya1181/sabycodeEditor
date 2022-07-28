import React from "react";
import { useNavigate } from "react-router-dom";
import plus from "../img/plus.svg";

export default function CreateMeeting(props) {
  const navigate = useNavigate();
    return (
      <>
        <button className="create__meeting" onClick={() => {navigate(`/editor/f${ (+new Date()).toString(16)}`)}}><img src={plus}></img>Создать собрание</button>
      </>
    );
  }