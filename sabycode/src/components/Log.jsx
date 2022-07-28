import React from "react";
import Meeting from "./Meeting";
import { useGetConnectionsQuery } from "../redux/api/sabycodeApi";
import { useMemo } from "react";
export default function Log(props) {
  const { data: sessions, isLoading } = useGetConnectionsQuery();
  const memoizedMeetings = useMemo(() => {
    return sessions?.map((session) => (
      <Meeting
        key={session.file}
        time={formatDate(new Date(session.birthtime))}
        edited={formatDate(new Date(session.updatetime))}
        prog={session.language}
        name={session.users.join(", ")}
        id={session.file}
      />
    )).reverse()
  }, [sessions]);

  function formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
    let zz = date.toTimeString();
    let zzz = zz.split(' ');
    let zzzz = zzz[0].split(':');
    let zzzzz = zzzz[0] + ':' + zzzz[1]
    return dd + '.' + mm + '.' + yy + ' ' + zzzzz;
  }
  // Функция для парсинга даты как на макете, вроде должно работать 

  return (
    <div className="app">
      <table className="table">
        <tbody>
          <tr>
            <th>
              <h1 className="log__name">Журнал собраний</h1>
            </th>
          </tr>
        </tbody>
        <tbody className="container container__header">
          <tr>
            <td className="begin">ДАТА СОЗДАНИЯ</td>
            <td className="edit">ДАТА ОКОНЧАНИЯ</td>
            <td className="named__lang">ТЕХНОЛОГИЯ</td>
            <td className="family">УЧАСТНИКИ</td>
          </tr>
        </tbody>
       {memoizedMeetings}
      </table>
    </div>
  );
}
