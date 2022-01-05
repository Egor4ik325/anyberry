import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// Custom pages
import Signup from "./Signup";
import Account from "./Account";
import NotFound from "./NotFound";
import EmailVerification from "./EmailVerification";

// Custom components
import {
  Header, Footer, Home, About, Contact, Berry,
  Login, Logout,
  Cart,
} from "./components";

// API client functions
import { checkSession } from "../api/Auth";

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
    <>
      <Router>
        <Header isAuthenticated={isAuthenticated} />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/berries/:id" exact children={<Berry isAuthenticated={isAuthenticated} />} />
          {
            // Conditional routing
            isAuthenticated ?
              [
                <Route path="/cart" exact children={<Cart isAuthenticated={isAuthenticated} />} />,
                <Route path="/account" exact children={<Account />} />,
                <Route path="/logout" exact children={<Logout />} />,
              ]
              :
              [
                <Route path="/about" exact component={() => <About />} />,
                <Route path="/contact" exact component={() => <Contact />} />,
                <Route path="/login" exact children={<Login />} />,
                <Route path="/signup" exact children={<Signup />} />,
                <Route path="/email/verify/:email" exact children={ <EmailVerification /> } />,
              ]
          }
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </>
  );
}

export default App;
