import React, { Fragment, useState, useEffect } from "react";
import {
  Header, Footer, Home, About, Contact, Berry,
  Login, Signup,
  Cart,
} from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { checkSession } from "./api/Auth";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const checkAuthenticated = async _ => {
    const authenticated = await checkSession();
    setAuthenticated(authenticated);
  }

  useEffect(() => {
    // Check client-server session
    checkAuthenticated();
  }, [isAuthenticated]);

  return (
    <React.Fragment>
      <Router>
        <Header isAuthenticated={isAuthenticated} />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/about" exact component={() => <About />} />
          <Route path="/contact" exact component={() => <Contact />} />
          <Route path="/berries/:id" exact children={<Berry isAuthenticated={isAuthenticated} />} />
          <Route path="/cart" exact children={<Cart isAuthenticated={isAuthenticated} />} />
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
