import React from "react";
import axios from "axios";
import { API_URL } from "../Constants";
import { Container, Card, CardBody, CardSubtitle, CardText, CardTitle, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

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
        return berries.map(berry =>
            <Card className="mb-3" key={berry.id}>
                <Row noGutters>
                    {/* Card with image/body relation = 4/8 */}
                    <Col md="4" className="d-flex justify-content-center align-items-center">
                        <img className="img-fluid rounded-start bg-light" src={berry.image} alt="Berry product" style={{ 'maxHeight': 200 }} />
                    </Col>
                    <Col md="8">
                        <CardBody>
                            <CardTitle className="mb-2">
                                <Link to={`/berries/${berry.id}`} className="text-decoration-none">
                                    <h5>{berry.title}</h5>
                                </Link>
                            </CardTitle>
                            <CardText>Small description</CardText>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
        <Container>
            <h1>Berries from REST API!</h1>
            <p>Berries:</p>
            {
                berries.length === 0 ? (
                    <p>Fetching berries...</p>
                ) : (
                    renderBerries()
                )
            }
        </Container>
    );
}

export default Home;