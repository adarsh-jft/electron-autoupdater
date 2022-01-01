import Button from "@mui/material/Button";
import React from "react";

const { ipcRenderer } = window.require("electron");
const HomeScreen = () => {
  return (
    <div>
      <div className="retrieveData">
        <div className="retrieveText">
          <p>
            No Photos are loaded for processing <br></br> To retreive images off
            of your camera/SD card, click on <br></br> the Retrieve Photos
          </p>
          <Button>COPY</Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
