import Button from "@mui/material/Button";
import React from "react";

const { ipcRenderer } = window.require("electron");
const HomeScreen = () => {
  const checkForUpdates = () => {
    console.log("checking for updates");
    ipcRenderer.send("checkForUpdates");
  };
  const { ipcRenderer } = window.require("electron");
  ipcRenderer.on("message", (event, args) => {
    console.log(args);
  });
  return (
    <div>
      <div className="retrieveData">
        <div className="retrieveText">
          <p>Checking update version 0.3.0</p>
          <Button>COPY</Button>
          <Button onClick={checkForUpdates}>Check for updates</Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
