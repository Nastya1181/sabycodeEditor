import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/exports";
import {  selectUserName } from "../redux/features/authentication/authenticationSlice";
import GoogleAuth from "./GoogleAuth";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AuthPage(props) {
  //Todo: сделать вход через сбис/регистрацию (Настя)
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  return (
    <>
    <div className="auth">
      <div className="auth-header">Аутентификация</div>
      <GoogleAuth from={from}/>
      <button className="auth-sbis">
        <div className="auth-sbis__logo"></div>
        <div className="auth-sbis__text">Авторизоваться через СБИС</div>
      </button>
      <div className="auth__line"><span>или<br/></span></div>
      <Link className="auth-guest" to="/guestLogin"  replace state={{ from: from }} 
        >
        <div className="auth-guest__text">Войти, как гость</div>
      </Link>
    </div>
    </>
  );
}

