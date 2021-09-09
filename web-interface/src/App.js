import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Header, Footer, Home, About, Contact, Berry, Login, Signup } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { USER_URL } from "./Constants";

// Determine whether user session exists
async function checkSession() {
  // Try to fetch user name (requires session/be logged-in)
  const res = await axios.get(USER_URL, {
    withCredentials: true
  })
    .catch(err => {
      // Network error
      console.error("Request error: ", err);
      return false;
    });

  return res.ok;
}

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check client-server session
    (async () => { setAuthenticated(await checkSession()); })();
  }, [isAuthenticated]);

  return (
    <React.Fragment>
      <Router>
        <Header isAuthenticated={isAuthenticated} />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/about" exact component={() => <About />} />
          <Route path="/contact" exact component={() => <Contact />} />
          <Route path="/berries/:id" exact children={<Berry />} />
          {
            !isAuthenticated ?
              <Fragment>
                <Route path="/login" exact children={<Login />} />
                <Route path="/signup" exact children={<Signup />} />
              </Fragment>
              :
              <p>You are already logged-in!</p>
          }
        </Switch>
      </Router>
      <Footer />
    </React.Fragment>
  );
}

export default App;
