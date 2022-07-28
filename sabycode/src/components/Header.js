import { selectAccessToken, selectUserName } from "../redux/features/authentication/authenticationSlice";
import { useSelector } from "react-redux/es/exports";
import React, {  useState} from "react"
import { Link , useLocation} from "react-router-dom";
import LogOutButton from "./LogOutButton";
import CloseButton from "./CloseButton";
import Carousel from "./Carousel";
import Member from "./Member"
import { selectCurrentUsers } from "../redux/features/users/usersSlice";
import Backmain from "./Backmain";
import CreateMeeting from "./CreateMeeting";

export default function Header() {
  const userName = useSelector(selectUserName);
  const initialState = "Пригласить";
  const [buttonText, setButtonText] = useState(initialState);
  const accessToken = useSelector(selectAccessToken);
  const changeText = (text) => {
    setButtonText(text);
    setTimeout(() => setButtonText(initialState), [1000])
  }

  const currentUsers = useSelector(selectCurrentUsers);
  function Location() {
    const location = useLocation();
    if (location.pathname === "/log") {
      return (
        <div>
          <CreateMeeting /> {/* <Backmain /> */}
        </div>
      );
    }
  }
 
  function Edit() {
    const locat = useLocation();
    let url = locat.pathname.split("/editor/");
    let a = ("/editor/"+url[1]);
    if (locat.pathname === a){
        return <div>
          {userName && <Carousel show={3}>
                    {currentUsers?.map(user =>
                  <Member name={user.username} key={Date.now() + Math.random()} color={user.color}/>)}
                  </Carousel>}
                  {userName && (
                   <>
                      <button
                    className="invite-button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location);
                      changeText("Скопировано")
                    }}
                    >
                    <div className="invite-button__text">{buttonText}</div>
                      </button>
            <LogOutButton />
          </>
      )}
      {/* {accessToken && <LogButton/>} */}
      {accessToken && <CloseButton/>}
      {accessToken &&  <Link  className="magazine__log" to='/log'>Журнал событий</Link>}
     </div>
    }
  }
  return (
    <header className="header">
      <div className="header__logo__possion">
        <div className="header__logo"></div>
      </div>
      <Edit/>
      <Location/>
    </header>
  );
}
