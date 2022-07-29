import { useParams } from "react-router-dom";
import "ace-builds";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import { useEffect, useRef, useState } from "react";
import "ace-builds/src-noconflict/theme-textmate";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccessToken,
  selectColor,
  setColor,
  selectUserName,
} from "../redux/features/authentication/authenticationSlice";
import { useAddFileMutation } from "../redux/api/sabycodeApi";
import "../markers.css";
import {
  setCurrentUsers,
  removeUser,
} from "../redux/features/users/usersSlice";
import FontSizeSelect from "./FontSizeSelect";
import { selectIsReadOnly, selectHasUserChangedMeeting, setHasUserChangedMeeting, setIsReadOnly, setIsMeetingAdmin} from "../redux/features/meeting/meetingSlice";



export default function EditPage(props) {
  const socket = useRef();
  const [text, setText] = useState("");
  const [language, setLanguage] = useState();
  const [fontSize, setFontSize] = useState(14);
  const { id } = useParams();
  const accessToken = useSelector(selectAccessToken);
  const [addFile, { isSuccess: isFileAdded }] = useAddFileMutation();
  const dispatch = useDispatch();
  const [markers, setMarkers] = useState({});
  const isReadOnly = useSelector(selectIsReadOnly);
  const color = useSelector(selectColor);
  const hasUserChangedMeeting = useSelector(selectHasUserChangedMeeting);
  const userName = useSelector(selectUserName);
 /*  const fontSizes = useRef([...generateSequence(12, 32, 2)]); */


  useEffect(() => {
    if (isFileAdded) {
      socket.current.send(JSON.stringify({event:'firstUpdate', sessionId:id}));
    }
  }, [isFileAdded]);

  useEffect(() => {
    if (hasUserChangedMeeting) {
      console.log('hi');
      socket.current?.send(JSON.stringify({ sessionId: id, event: "close" }));
      dispatch(setHasUserChangedMeeting(false));
    }
  }, [hasUserChangedMeeting]); 
    
  useEffect(() => {
    socket.current = new WebSocket(process.env.REACT_APP_WS_BASE_URL);
    socket.current.onopen = (event) => {
      socket.current.send(
        JSON.stringify({
          sessionId: id,
          event: "connection",
          username: localStorage.userName,
          color: ["pink", "green", "orange", "blue", "aqua", "yellow"],
        })
      );
    };
    socket.current.onmessage = (event) => {
      const messageJSON = JSON.parse(event.data);
      switch (messageJSON.event) {
        case "editorUpdate":
          setText(messageJSON.input);
          break;
        case "connection":
          connectionHandler(messageJSON);
          break;
        case "close":
          dispatch(setIsReadOnly(messageJSON.abilityToEdit));
          break;
        case "markersUpdate":
          markersUpdateHandler(messageJSON);
          break;
        case "languageUpdate":
          languageUpdateHandler(messageJSON);
          break;
        case "colorUpdate":
          colorUpdateHandler(messageJSON);
          break;
        case "userUpdate":
          userUpdateHandler(messageJSON);
          break;
        default:
          break;
      }
    };
    const current = socket.current;

    return () => {
      current.close();
    };
  }, []);

  function userUpdateHandler(message) {
    dispatch(removeUser(message.color));
    setMarkers((markers) => {
      const modified = Object.assign({}, markers);
      modified[message.color] = [];
      return modified;
    });
  }

  function colorUpdateHandler(message) {
    dispatch(setColor(message.color));
  }

  function connectionHandler(messageJSON) {
    setText(messageJSON.input);
    setLanguage(messageJSON.language);
    dispatch(setIsReadOnly(!messageJSON.abilityToEdit));
    dispatch(setCurrentUsers(messageJSON.users));
    const addFileAsync = async () => {
      if (accessToken && userName === messageJSON.username) {
        await addFile({
          id: `${id}.txt`,
          user: accessToken,
          creator: userName,
        }).unwrap();
      }
    };
 
    addFileAsync();
    console.log(messageJSON.creator);
    if (userName === messageJSON.creator) {
      dispatch(setIsMeetingAdmin(true));
    }
  }
 
  function markersUpdateHandler(message) {
    setMarkers((markers) => {
      const modified = Object.assign({}, markers);
      modified[message.color] = message.markers;
      return modified;
    });
  }

  function languageUpdateHandler(message) {
    setLanguage(message.language);
  }

  function onChange(newValue) {
    socket.current.send(
      JSON.stringify({
        input: newValue,
        sessionId: id,
        event: "editorUpdate",
      })
    );
    setText(newValue);
  }


  function changeLanguage(event) {
    setLanguage(event.target.value);
    socket.current.send(
      JSON.stringify({
        sessionId: id,
        event: "languageUpdate",
        language: event.target.value,
      })
    );
  }

  function onCursorChange(selection) {
    let cursorMarker = {
      startRow: selection.cursor.row,
      startCol: selection.cursor.column,
      endRow: selection.cursor.row,
      endCol: selection.cursor.column + 1,
      className: `user-cursor_${color}`,
      type: "text",
      inFront: true,
    };
    const message = {
      sessionId: id,
      event: "markersUpdate",
      markers: [cursorMarker],
      color: color,
    };

    if (selection.$cursorChanged) {
      const modified = Object.assign({}, markers);
      modified[color] = [cursorMarker];
      setMarkers(modified);

      socket.current.send(JSON.stringify(message));
    }
  }

  function onSelectionChange(selection) {
    let message;
    if (
      !(
        selection.anchor.column === selection.cursor.column &&
        selection.anchor.row === selection.cursor.row
      )
    ) {
      let [start, end] =
        selection.anchor.column < selection.cursor.column
          ? [selection.anchor, selection.cursor]
          : [selection.cursor, selection.anchor];
      let cursorMarker = {
        startRow: selection.cursor.row,
        startCol: selection.cursor.column,
        endRow: selection.cursor.row,
        endCol: selection.cursor.column + 1,
        className: `user-cursor_${color}`,
        type: "text",
        inFront: true,
      };
      let selectionMarker = {
        startRow: start.row,
        startCol: start.column,
        endRow: end.row,
        endCol: end.column,
        className: `user-selection_${color}`,
        type: "text",
        inFront: false,
      };

      message = {
        sessionId: id,
        event: "markersUpdate",
        markers: [selectionMarker, cursorMarker],
        color: color,
      };

      if (selection.$cursorChanged) {
        const modified = Object.assign({}, markers);
        modified[color] = [cursorMarker, selectionMarker];
        setMarkers(modified);

        socket.current.send(JSON.stringify(message));
      }
    }
  }

  function getMarkers() {
    let allMarkersArray = [];
    if (Object.keys(markers).length === 0) return allMarkersArray;
    for (let color in markers) {
      allMarkersArray.push(...markers[color]);
    }
    return allMarkersArray;
  }

  return (
    <>
      <div className="buttons">
        <FontSizeSelect start={12} end={32} step={2} setFontSize={setFontSize} fontSize={fontSize}/>
        <select
          value={language}
          className="select-language"
          id="language"
          onChange={(event) => changeLanguage(event)}
        >
          <option value="javascript">javascript</option>
          <option value="python">python</option>
        </select>
      </div>
      <AceEditor
        value={text}
        mode={language}
        theme="textmate"
        height="100%"
        width="100%"
        onChange={onChange}
        onCursorChange={onCursorChange}
        onSelectionChange={onSelectionChange}
        fontSize={fontSize}
        highlightActiveLine={false}
        readOnly={isReadOnly}
        markers={getMarkers()}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: false }}
      />
    </>
  );
}
