import Button from "@mui/material/Button";
import React from "react";

const { ipcRenderer } = window.require("electron");
const HomeScreen = () => {
  const checkForUpdates = () => {
    console.log("checking for updates");
    ipcRenderer.send("checkForUpdates");
  };
  return (
    <div>
      <div className="retrieveData">
        <div className="retrieveText">
          <p>
            No Photos are loaded for processing <br></br> To retreive images off
            of your camera/SD card, click on <br></br> the Retrieve Photos and
            also checking update............
          </p>
          <Button>COPY</Button>
          <Button onClick={checkForUpdates}>Check for updates</Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
