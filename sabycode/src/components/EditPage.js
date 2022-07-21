import { useParams } from "react-router-dom";
import "ace-builds";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import { useCallback, useEffect, useState } from "react";
import "ace-builds/src-noconflict/theme-textmate";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccessToken,
  selectClosedMeeting,
  selectIsUserConnected,
  selectUserName,
  setIsUserConnected,
} from "../redux/features/authentication/authenticationSlice";
import { useAddFileMutation } from "../redux/api/sabycodeApi";
import "../markers.css";

export default function EditPage(props) {
  const [socket, setSocket] = useState();
  const [text, setText] = useState("");
  const [language, setLanguage] = useState();
  const [fontSize, setFontSize] = useState(14);
  const { id } = useParams();
  const accessToken = useSelector(selectAccessToken);
  const [addFile, { isSuccess: isFileAdded }] = useAddFileMutation();
  const isUserConnected = useSelector(selectIsUserConnected);
  const dispatch = useDispatch();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [markers, setMarkers] = useState({});
  const isClosedMeeting = useSelector(selectClosedMeeting);

useEffect(() => {
  console.log("markersState", markers);
}, [markers]);

  useEffect(() => {
    const addFileAsync = async () => {
      if (accessToken && !isUserConnected) {
        //&& text
        let res = await addFile({
          id: `${id}.txt`,
          user: accessToken,
        }).unwrap();
      }
    };

    addFileAsync();
  }, [accessToken]); //,text

  useEffect(() => {
    dispatch(setIsUserConnected(false));
  }, []);

  useEffect(() => {
    if (isFileAdded) {
      dispatch(setIsUserConnected(true));
    }
  }, [isFileAdded]);

  useEffect(() => {if (isClosedMeeting){
    closeConnection();
  }}, [isClosedMeeting]);

  const memoizedCallback = useCallback(() => {
    const socket = new WebSocket(process.env.REACT_APP_WS_BASE_URL); 
    socket.onopen = (event) => {
      socket.send(
        JSON.stringify({
          sessionId: id,
          event: "connection",
          username: localStorage.userName,
        })
      );
    };
    socket.onmessage = (event) => {
      const messageJSON = JSON.parse(event.data);
      switch (messageJSON.event) {
        case "editorUpdate":
          setText(messageJSON.input);
          break;
        case "connection":
          setText(messageJSON.input);
          setLanguage(messageJSON.language);
          if (!messageJSON.abilityToEdit) {
            socket.close();
            setIsReadOnly(true);
          }
          break;
        case "close":
          socket.close();
          setIsReadOnly(true);
          break;
        case "markersUpdate":
          markersUpdateHandler(messageJSON);
          break;
        case "languageUpdate":
          languageUpdateHandler(messageJSON);
          break;
      }
    };
    setSocket(socket);
  }, [id]);

  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback, id]);

  function onChange(newValue) {
    console.log('hi');
    socket.send(
      JSON.stringify({
        input: newValue,
        sessionId: id,
        event: "editorUpdate",
      })
    );
    setText(newValue);
  }

  function changeFontSize(event) {
    setFontSize(parseInt(event.target.value));
  }

  function changeLanguage(event) {
    setLanguage(event.target.value);
    socket.send(
      JSON.stringify({
        sessionId: id,
        event: "languageUpdate",
        language: event.target.value,
      })
    );
  }

  function closeConnection() {
    socket.send(JSON.stringify({ sessionId: id, event: "close" }));
  }

  function onCursorChange(selection) {
    console.log(selection);
    let cursorMarker = {
      startRow: selection.cursor.row,
      startCol: selection.cursor.column,
      endRow: selection.cursor.row,
      endCol: selection.cursor.column + 1,
      className: `user-cursor_${localStorage.userColor}`,
      type: "text",
      inFront: true,
    };
    const message = {
      sessionId: id,
      event: "markersUpdate",
      markers: [cursorMarker],
      color: localStorage.userColor
      
    };
    console.log(selection.$cursorChanged);

    

    if (selection.$cursorChanged) {
/*       let nMarkers = Object.assign({}, markers);
      nMarkers[localStorage.userColor] =  [cursorMarker];
      setMarkers(nMarkers); */

      console.log('mymarkerChanged', message.markers);
      console.log("отправленные маркеры", message.markers);
      socket.send(JSON.stringify(message));
    }

  }

  function markersUpdateHandler(message) {
    if (message.color != localStorage.userColor) {
      console.log('MyMarkersOnMessage', markers);
      const newMarkers = { ...markers };

      console.log("полученные маркеры", message.markers);
       console.log("полученный цвет", message.color);
   
      newMarkers[message.color] = message.markers;
      setMarkers(newMarkers);
    }
    

  }

  function languageUpdateHandler(message) {
    setLanguage(message.language);
  }

  function onSelectionChange(selection) {
 
    console.log(selection);
    let message;
    if (selection.anchor.column === selection.cursor.column) {
      let cursorMarker = {
        startRow: selection.cursor.row,
        startCol: selection.cursor.column,
        endRow: selection.cursor.row,
        endCol: selection.cursor.column + 1,
        className: `user-cursor_${localStorage.userColor}`,
        type: "text",
        inFront: true,
      };
       message = {
        sessionId: id,
        event: "markersUpdate",
        markers: [cursorMarker],
        color: localStorage.userColor,
      };
    } else {
      let [start, end] =
        selection.anchor.column < selection.cursor.column
          ? [selection.anchor, selection.cursor]
          : [selection.cursor, selection.anchor];
      let cursorMarker = {
        startRow: selection.cursor.row,
        startCol: selection.cursor.column,
        endRow: selection.cursor.row,
        endCol: selection.cursor.column + 1,
        className: `user-cursor_${localStorage.userColor}`,
        type: "text",
        inFront: true,
      };
      let selectionMarker = {
        startRow: start.row,
        startCol: start.column,
        endRow: end.row,
        endCol: end.column,
        className: `user-selection_${localStorage.userColor}`,
        type: "text",
        inFront: false,
      };

      message = {
        sessionId: id,
        event: "markersUpdate",
        markers: [selectionMarker, cursorMarker],
        color: localStorage.userColor,
      };


    }
    if (selection.$cursorChanged || selection.$anchorChanged) {
      console.log('mymarkerChanged', message.markers);
      console.log("отправленные маркеры", message.markers);
      socket.send(JSON.stringify(message));
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
{/*       <button onClick={closeConnection}>CLOSE</button> */}
      <div className="buttons">
        <select
          className="select-fontSize"
          id="fontSize"
          onChange={(event) => changeFontSize(event)}
        >
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
        </select>
        <select
          value={language}
          defaultValue={language}
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
        editorProps={{ $blockScrolling: true }}
      />
    </>
  );
}
