import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";
import Homepage from "./Homepage";
import CharityRegistration from "./CharityRegistration.js";
import UserRegistration from "./userRegistration.js";
import CharityHomePage from "./ChairtyHomePage.js";
import LoginPage from "./LoginPage.js";
import DonorHomepage from "./DonorHomepage.js";
import CharityProfile from "./charityprofile.js";
import DonorProfile from "./DonorProfile";
const Pages = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/charityregistration">
          <CharityRegistration />
        </Route>
        <Route exact path="/userregistration">
          <UserRegistration />
        </Route>
        <Route exact path="/loginpage">
          <LoginPage />
        </Route>
        <Route exact path="/charityhome">
          <CharityHomePage />
        </Route>
        <Route exact path="/donorhome">
          <DonorHomepage />
        </Route>
        <Route exact path="/charityprofile">
          <CharityProfile />
        </Route>
        <Route exact path="/donorprofile">
          <DonorProfile />
        </Route>
      </Switch>
    </Router>
  );
};
ReactDOM.render(
  <React.StrictMode>
    <Pages />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
