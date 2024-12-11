import React, { useState } from "react";
import "../App.css";

const SideBar = ({ setSideBar }) => {

  const [activeButton, setActiveButton] = useState("msgButton");

  const handleToggle = (value, buttonType) => {
    setSideBar(value);
    setActiveButton(buttonType);
  };

  return (
    <>
      <div style={{ minHeight: "100vh", width: "70px", backgroundColor: "#464646" }} className="d-flex flex-column justify-content-between align-items-center" >
        <div>
          <button
            onClick={() => handleToggle(true, "msgButton")}
            className={`mt-4 msgButton ${
              activeButton === "msgButton" ? "button_active" : ""
            }`}
          >
            <i className="fa-regular fa-message fs-4"></i>
          </button>
        </div>
        <div>
          <button
            onClick={() => handleToggle(false, "userButton")}
            className={`mb-4 userButton ${
              activeButton === "userButton" ? "button_active" : ""
            }`}
          >
            <i className="fa-regular fa-user fs-4"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
