import React from "react";
import axios from "axios";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/"

const Home = () => {
    let [berries, setBerries] = React.useState([]);

    React.useEffect(() => {
        axios.get(API_URL + 'berries/')
            .then(response => {
                console.log(response);
                setBerries(response.data);
            })

    }, [setBerries]);

    function renderBerries() {
        return berries.map(berry => <ListGroupItem><Link to={`/berries/${berry.id}`}>{berry.title}</Link></ListGroupItem>);
    }

    return (
        <Container>
            <h1>Berries from REST API!</h1>
            <p>Berries:</p>
            {
                berries.length === 0 ? (
                    <p>Fetching berries...</p>
                ) : (
                    <ListGroup>
                        {renderBerries()}
                    </ListGroup>
                )
            }
        </Container>
    );
}

export default Home;