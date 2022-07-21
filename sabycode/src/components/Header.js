import { selectAccessToken, selectUserName, setAccessToken, setUserName } from "../redux/features/authentication/authenticationSlice";
import { useDispatch, useSelector } from "react-redux/es/exports";
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useLogoutMutation } from "../redux/api/sabycodeApi";
import LogOutButton from "./LogOutButton";
import LogButton from "./LogButton";
import CloseButton from "./CloseButton";
export default function Header() {
  const userName = useSelector(selectUserName);
  const initialState = "ПРИГЛАСИТЬ";
  const [buttonText, setButtonText] = useState(initialState);
  const accessToken = useSelector(selectAccessToken);
  const changeText = (text) => {
    setButtonText(text);
    setTimeout(() => setButtonText(initialState), [1000])
  }
 
  return (
    <header className="header">
      <div className="header__logo__possion">
        <div className="header__logo"></div>
      </div>
      {userName && (
        <>
          <button
            className="invite-button"
            onClick={() => {
              navigator.clipboard.writeText(window.location);
              changeText("СКОПИРОВАНО")
            }}
          >
            <div className="invite-button__text">{buttonText}</div>
          </button>
        <LogOutButton />
        </>
      )}
      {/* {accessToken && <LogButton/>} */}
      {accessToken && <CloseButton/>}  
      {accessToken &&  <Link  className="event__log" to='/log'>Журнал событий</Link>}
    </header>
  );
}
