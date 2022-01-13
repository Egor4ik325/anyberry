import { useEffect, useState } from "react";
import client from "../api";
import { getBerry } from "../api/Berry";

import Price from "./components/Price";
import {
    Container,
    Card, CardBody,
    Row, Col,
    Button,
} from "reactstrap";

const Favorite = (props) => {
    const [favorites, setFavorites] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            const berryIds = await client.favorite.list();
            // Fetch complete information about each favorite berry
            setFavorites(await Promise.all(berryIds.map(async id => await getBerry(id))));
        }
        fetchFavorites();
    }, [])

    const handleUnfavorite = (id) => {
        // TODO
    }

    const handleCart = (id) => {
        // TODO
    }

    return (
        <Container>
            <h2>Favorite List:</h2>
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