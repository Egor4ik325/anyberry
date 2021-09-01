import React from "react";
import { Header, Footer, Home, About, Contact, Berry } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


function App() {
  return (
    <React.Fragment>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/about" exact component={() => <About />} />
          <Route path="/contact" exact component={() => <Contact />} />
          <Route path="/berries/:id" exact children={<Berry />} />
        </Switch>
      </Router>
      <Footer />
    </React.Fragment>
  );
}

export default App;
