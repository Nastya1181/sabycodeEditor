import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import EditPage from './components/EditPage'
import GuestForm from './components/GuestForm';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import { selectAccessToken, selectUserName } from './redux/features/authentication/authenticationSlice';
import Log from './components/Log'
function App() {
  const name = useSelector(selectUserName);
  const token = useSelector(selectAccessToken);


  useEffect(() => {
    localStorage.accessToken = token;
  }, [token]);
  useEffect(() => {
    localStorage.userName = name;
  }, [name]);
 /*  useEffect(() => {
    localStorage.userName = name;
  }, [name]);  */



  return (
    <Router>
    <Routes>
        <Route path='/' element={<Layout />}>
        <Route  path='/authentication' element={<AuthPage />}/>
        <Route path='/guestLogin' element={<GuestForm />}></Route>
        <Route index element={<RequireAuth required={name}><Navigate to={`/editor/f${ (+new Date()).toString(16)}`}/></RequireAuth>}/>
        <Route  path='editor/:id' element={<RequireAuth required={name}><EditPage /></RequireAuth>}/>
        <Route  path='/log' element={<RequireAuth required={token}><Log /></RequireAuth>}/>
        <Route  path='*' element={<h1>Нет такой страницы</h1>}/>
        </Route>
    </Routes>
</Router>
  );
}

export default App;

