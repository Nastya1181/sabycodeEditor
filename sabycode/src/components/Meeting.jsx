import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../img/delete.svg';
import { useRemoveConnectionMutation } from "../redux/api/sabycodeApi";
export default function Meeting(props) {
  const [removeConnection, {}] = useRemoveConnectionMutation();
  const navigate = useNavigate();
  return (
    <tbody>
      <tr
        id={props.id}
        className="container"
        onClick={(event) => {
          navigate(`/editor/${event.currentTarget.id.split(".")[0]}`);
        }}
      >
        <td className="begin">{props.time}</td>
        <td className="edit">{props.edited}</td>
        <td className="named__lang font-weight">{props.prog}</td>
        <td className="family">{props.name}</td>
        <td>
          <button
            className="delete__button"
            id={props.id}
            onClick={async (event) => {
              console.log(event.currentTarget.id);
              event.stopPropagation();
              await removeConnection({ stat: event.currentTarget.id }).unwrap();
            }}
          >
            <div className="delete__inside">
              <img className="delete__logo" src={logo} />
              <span className="delete__meeting">Удалить</span>
            </div>
          </button>
        </td>
      </tr>
    </tbody>
  );
}
