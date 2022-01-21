import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";

// Import Bootstrap pre-compiled CSS and JavaScript files
// import "bootstrap/dist/css/bootstrap.css"
// import "bootstrap/dist/js/bootstrap"

// Bootstrap icons kit
import "bootstrap-icons/font/bootstrap-icons.css";

import "./scss/anyberry.scss";
import "./scss/index.scss";

import "./css/anyberry.css";
import "./css/favorite.css";
import "./css/Signup.css";
import "./css/Landing.css";

// Just renders main App component
ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
