import React, { useState } from "react";

const ToDoFooter = (props) => {
  const [date, setDate] = useState(props.date);
  const minDate = props.date;
  const maxDate = "2030-12-31";

  const handleChange = (event) => {
    let newDate = event.target.value;
    setDate(newDate);

    if (newDate > maxDate) {
      props.updateField(props.table, props.id, "date", maxDate);
    } else if (newDate < minDate || newDate === "") {
      props.updateField(props.table, props.id, "date", minDate);
    } else {
      props.updateField(props.table, props.id, "date", newDate);
    }
  };

  return (
    <div className="item-footer">
      <span className="item-date">
        Due:
        <input
          type="date"
          value={date}
          onChange={handleChange}
          className="date-input"
          min={minDate}
          max={maxDate}
        />
      </span>
      <div className="item-buttons">
        <button
          className="item-button take-btn"
          onClick={() =>
            props.moveToOtherTable(props.table, "In Progress", {
              id: props.id,
              text: props.text,
              date: date,
            })
          }
        >
          Take
        </button>
        <button
          className="item-button delete-btn"
          onClick={() => props.deleteItem(props.id, props.table)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ToDoFooter;
