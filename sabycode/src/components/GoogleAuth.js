import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux/es/exports';
import { useNavigate } from 'react-router-dom';
import { setAccessToken, setUserName } from '../redux/features/authentication/authenticationSlice';
import { useLoginMutation } from '../redux/api/sabycodeApi';

export default function GoogleAuth(props) {
    const dispatch = useDispatch();
    const [login, {isSuccess}] = useLoginMutation();
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const navigate = useNavigate();

    async function handleCallbackResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      const user = jwt_decode(response.credential);
      setUser(user);
      await login({ username: user.name, 
        email: user.email}).unwrap();
    }

    useEffect(() => {if (isSuccess) {
      dispatch(setUserName(user.name));

      /* localStorage.userName = user.name; */
     /*  localStorage.accessToken = token; */
     navigate(props.from, { replace: true });
    }}, [isSuccess]);

    useEffect(() => {
      /* global google */
      google.accounts.id.initialize({
        client_id: "390701907032-mlb8sq8vi5aos6liqs4u4241fhj0bb92.apps.googleusercontent.com",
        callback: handleCallbackResponse
      })
  
      google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        {
          theme: "outline", size: "large", width: '280px', height: '40px'
        }
      );
     
    }, []);


return <div id="googleSignIn"></div>
}