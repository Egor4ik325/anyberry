import { useEffect, useState } from "react";
import client from "../api";
import { getBerry } from "../api/Berry";
import { addCartBerry } from "../api/Cart";

import Price from "./components/Price";
import {
    Container,
    Card, CardBody,
    Row, Col,
    Button,
    Alert,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faHeartBroken, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Favorite = (props) => {
    const [favorites, setFavorites] = useState(null);
    const [message, setMessage] = useState({ msg: null, color: null });

    useEffect(() => {
        const fetchFavorites = async () => {
            const berryIds = await client.favorite.list();
            // Fetch complete information about each favorite berry
            setFavorites(await Promise.all(berryIds.map(async id => await getBerry(id))));
        }
        fetchFavorites();
    }, [])

    const handleClear = async () => {
        await client.favorite.clear();
        setFavorites([]);
    }

    const handleUnfavorite = async (id) => {
        await client.favorite.remove({ id });
        setFavorites(favorites.filter(favorite => favorite.id !== id));
        displayMessage({ msg: "Successfully unfavorite", color: "success" });
    }

    const handleCart = async (id) => {
        addCartBerry(id);
        displayMessage({ msg: "Successfully added to the cart", color: "success" });
    }

    const displayMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage(null);
        }, 5000);
    }

    return (
        <Container>
            <h2>Favorite List:</h2>
            {
                message?.msg && <Alert color={message.color}>{ message.msg }</Alert>
            }
            <div className="favorite-bar mb-2">
                <Button onClick={handleClear} className="favorite-clear">
                    <FontAwesomeIcon icon={faTrashAlt} className="me-2" />Clear favorites
                </Button>
            </div>
            {
                // Render cards
                favorites
                &&
                favorites.map(favorite => (
                    <Card key={favorite.id} className="favorite-card">
                        <CardBody>
                            <Row>
                                <Col className="ps-sm-5"><img src={favorite.image} height={70} /></Col>
                                <Col className="fw-bolder">{favorite.title}</Col>
                                <Col>{Price({amount: favorite.price, currency: favorite.price_currency})}</Col>
                                <Col className="d-flex flex-column flex-sm-row gap-1 justify-content-center">
                                    <Button color="dark" onClick={() => handleUnfavorite(favorite.id)}>
                                        <FontAwesomeIcon icon={faHeartBroken} />
                                    </Button>
                                    <Button color="dark" onClick={() => handleCart(favorite.id)}>
                                        <FontAwesomeIcon icon={faShoppingCart} />
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                ))
            }
        </Container>
    );
}

export default Favorite;