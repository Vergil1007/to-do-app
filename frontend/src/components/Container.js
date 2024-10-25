import React, { useState, useEffect } from "react";
import InputArea from "./InputArea";
import Item from "./Item";

const Container = (props) => {
  const [items, setItems] = useState([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch(`/api/items/${props.name}`)
      .then((responce) => responce.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error:", error));
  }, [props.name, props.triggerRefresh]);

  const addItem = (item, table) => {
    fetch(`/api/items/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: item.text,
        date: item.date ? item.date : today,
      }),
    })
      .then((responce) => responce.json())
      .then((newItem) => setItems((prevItems) => [...prevItems, newItem]))
      .catch((error) => console.error("Error:", error));
  };
  const deleteItem = (id, table) => {
    fetch(`/api/items/${table}/${id}`, {
      method: "DELETE",
    })
      .then((responce) => responce.json())
      .then(() => {
        setItems((prevItems) => {
          return prevItems.filter((item) => {
            return item.id !== id;
          });
        });
      })
      .catch((error) => console.error("Error:", error));
  };

  const moveToOtherTable = async (tableFrom, tableTo, item) => {
    await fetch(`/api/items/${tableFrom}/${item.id}`, {
      method: "DELETE",
    });

    await fetch(`/api/items/${tableTo}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: item.text,
        date: item.date,
      }),
    });

    props.triggerRefresh();
  };
  return (
    <div className="container">
      <div className="heading">
        <h1
          className={
            props.name === "To Do"
              ? "todo"
              : props.name === "In Progress"
              ? "in-progress"
              : props.name === "Done"
              ? "done"
              : null
          }
        >
          {props.name}
        </h1>
      </div>
      <InputArea table={props.name} addItem={addItem} />
      <div>
        {items
          .slice()
          .reverse()
          .map((item) => (
            <Item
              key={item.id}
              id={item.id}
              text={item.text}
              date={item.date}
              table={props.name}
              deleteItem={deleteItem}
              addItem={addItem}
              moveToOtherTable={moveToOtherTable}
            />
          ))}
      </div>
    </div>
  );
};

export default Container;
