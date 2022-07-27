import React from "react";
import '../user-color.css'
function Member(props) {
    return (
      <div className="members">
          <div className={`circle__user user-color_${props.color}`}></div>
          <div className="members__text">{props.name}</div>
      </div>
    );
  }

export default Member;