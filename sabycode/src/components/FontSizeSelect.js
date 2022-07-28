import { useMemo } from "react";

export default function FontSizeSelect(props) {
  const memoizedFontSizes = useMemo(() => {
    const items = [];
    for (let i = props.start; i <= props.end; i += props.step) {
      items.push(i);
    }
    return items;
  }, [props.start, props.end, props.step]);

  function changeFontSize(event) {
    props.setFontSize(parseInt(event.target.value));
  }

  return (
    <select
      className="select-fontSize"
      id="fontSize"
      onChange={(event) => changeFontSize(event)}
      value={props.fontSize}
    >
      {memoizedFontSizes.map((fontSize) => (
        <option value={fontSize.toString()} key={Date.now() + Math.random()}>
          {fontSize}
        </option>
      ))}
    </select>
  );
}
