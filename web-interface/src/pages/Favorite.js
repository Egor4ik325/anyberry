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
            <Button onClick={handleClear}>Clear favorites</Button>
            {
                // Render cards
                favorites
                &&
                favorites.map(favorite => (
                    <Card key={favorite.id}>
                        <CardBody>
                            <Row>
                                <Col className="ps-5"><img src={favorite.image} height={70} /></Col>
                                <Col>{favorite.title}</Col>
                                <Col>{Price({amount: favorite.price, currency: favorite.price_currency})}</Col>
                                <Col>
                                    <Button onClick={() => handleUnfavorite(favorite.id)}>Unfavorite</Button>
                                    <Button onClick={() => handleCart(favorite.id)}>Add to cart</Button>
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