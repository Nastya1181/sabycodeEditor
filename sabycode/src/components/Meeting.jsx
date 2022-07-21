import React from "react";
import logo from '../img/delete.svg';
import { useRemoveConnectionMutation } from "../redux/api/sabycodeApi";
export default function Meeting(props) {
  const [removeConnection, {}] = useRemoveConnectionMutation();
    return (
    <div>
        <div id={props.id} className="table">
          <div className="begin">{props.time}</div>
          <div className="named__lang">{props.prog}</div>
          <div className="edit">{props.edited}</div>
          <div className="family">{props.name}</div>
          <button className="delete__logo"><img src={logo} onClick={async (event) => {console.log(event.target.parentNode.parentNode);await removeConnection({stat: event.target.parentNode.parentNode.id}).unwrap()}} /></button>
        </div>
      </div>
    );
}
