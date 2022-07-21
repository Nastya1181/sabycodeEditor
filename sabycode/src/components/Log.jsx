import React, { useEffect } from "react";
import Meeting from "./Meeting";
import { useDispatch } from "react-redux";
import { useGetConnectionsQuery } from "../redux/api/sabycodeApi";
import { setIsUserConnected } from "../redux/features/authentication/authenticationSlice";

export default function Log(props) {
  const { data: sessions, isLoading } = useGetConnectionsQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsUserConnected(false));
/*   localStorage.isUserConnected = false; */
  }, []);
  console.log(sessions);

  return (
    <div className="app">
      <h1 className="log__name">Журнал</h1>
      <div className="table font__header">
        <div className="begin">Создано</div>
        <div className="named__lang">Язык</div>
        <div className="edit">Редактировано</div>
        <div className="family">Участники</div>
        <div className="delete">Удалить</div>
      </div>
      {sessions?.map(session => 
        <Meeting key={session.file}
          time={session.birthtime}
          prog={session.language}
          edited={session.updatetime}
          name={session.users.join(', ')}
          id={session.file}
        />
      )}
    </div>
  );
}
