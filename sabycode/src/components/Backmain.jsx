import React from "react";
import { Link } from 'react-router-dom'
export default function Backmain(props) {
    return (
      <div>
        <Link className="back__main" to={""}>Вернуться на главную</Link>
      </div>
    );
  }
