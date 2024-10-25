import React, { useState } from "react";

const InputArea = (props) => {
  const [inputText, setInputText] = useState("");

  const handleChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
  };
  return (
    <div className="form">
      <input
        onChange={(event) => {
          return handleChange(event);
        }}
        type="text"
        value={inputText}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            props.addItem({ text: inputText }, props.table);
            setInputText("");
          }
        }}
        placeholder="Enter your task"
      />
      <button
        className="add-button"
        onClick={() => {
          if (inputText === "") {
            alert("You can't add empty task!");
          } else {
            props.addItem({ text: inputText }, props.table);
            setInputText("");
          }
        }}
      >
        <span>Add</span>
      </button>
    </div>
  );
};

export default InputArea;
