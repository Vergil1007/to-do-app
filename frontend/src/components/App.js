import React, { useState } from "react";
import Container from "./Container";

const App = () => {
  const [isRefresh, setIsRefresh] = useState(false);

  const triggerRefresh = () => {
    setIsRefresh(!isRefresh);
  };
  return (
    <div className="container-row">
      <Container name="To Do" triggerRefresh={triggerRefresh} />
      <Container name="In Progress" triggerRefresh={triggerRefresh} />
      <Container name="Done" triggerRefresh={triggerRefresh} />
    </div>
  );
};

export default App;
