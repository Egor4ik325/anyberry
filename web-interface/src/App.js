import React from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/"

function App() {
  let [berries, setBerries] = React.useState([])

  React.useEffect(() => {
    axios.get(API_URL + 'berries/')
      .then(data => {
        setBerries(data);
      })

  }, [setBerries, berries]);

  function renderBerries() {
    return JSON.stringify(berries);
  }

  return (
    <div>
      <h1>Fetching berries data from API!</h1>
      {
        berries.length === 0 ? (
          <p>No berries</p>
        ) : (
          <p>Berries exists:
            {renderBerries()}
          </p>
        )
      }
    </div>
  );
}

export default App;
