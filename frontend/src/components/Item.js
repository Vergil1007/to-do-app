import React, { useState } from "react";
import ToDoFooter from "./ToDoFooter";
import InProgressFooter from "./InProgressFooter";
import DoneFooter from "./DoneFooter";

const Item = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.text);

  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setText((prevText) => prevText + "\n");
    } else if (event.key === "Enter") {
      setIsEditing(false);
      updateField(props.table, props.id, "text", text);
    }
  };

  const updateField = (table, id, field, value) => {
    fetch(`/api/items/${table}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field: field, value: value }),
    })
      .then((responce) => responce.json())
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="item-container">
      <div className="item-content">
        {isEditing ? (
          <textarea
            className="item-textarea"
            type="text"
            value={text}
            onChange={handleChange}
            onBlur={() => {
              setIsEditing(false);
              updateField(props.table, props.id, "text", text);
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            rows="3"
          />
        ) : (
          <p className="item-text" onClick={() => setIsEditing(true)}>
            {text}
          </p>
        )}
        {props.table === "To Do" ? (
          <ToDoFooter
            id={props.id}
            table={props.table}
            text={props.text}
            date={props.date}
            deleteItem={props.deleteItem}
            updateField={updateField}
            moveToOtherTable={props.moveToOtherTable}
          />
        ) : props.table === "In Progress" ? (
          <InProgressFooter
            id={props.id}
            table={props.table}
            text={props.text}
            date={props.date}
            updateField={updateField}
            moveToOtherTable={props.moveToOtherTable}
          />
        ) : props.table === "Done" ? (
          <DoneFooter
            id={props.id}
            table={props.table}
            date={props.date}
            deleteItem={props.deleteItem}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Item;
