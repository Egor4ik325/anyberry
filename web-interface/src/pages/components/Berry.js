import React from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Container, Row, Col, InputGroup, InputGroupText, Input, Button } from "reactstrap";

import { API_URL } from "../../api/constants";
import { getCartBerries, addCartBerry, removeCartBerry } from "../../api/Cart";

import client from "../../api";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function Berry(props) {
    let { id } = useParams();
    id = parseInt(id);
    const [berry, setBerry] = React.useState(null);
    const [inCart, setInCart] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);

    React.useEffect(() => {
        // Async data fetching inside sync effect
        async function fetchData() {
            const res = await axios.get(API_URL + `berries/${id}/`);
            setBerry(res.data);
        }
        async function checkInCart() {
            try {
                const cartBerries = await getCartBerries();
                setInCart(cartBerries.includes(id));
            } catch (err) {
                console.error("Check in cart error: ", err);
                setInCart(false);
            }
        }

        const checkInFavorites = async () => {
            const favorites = await client.favorite.list();
            setIsFavorite(favorites.includes(id));
        }

        fetchData();
        checkInCart();
        checkInFavorites();
    }, [id, setBerry, setInCart]);

    if (!berry) {
        return null;
    }

    const addToCart = async () => {
        try {
            const response = await addCartBerry(id);
            if (response.status === 201) {
                // trigger checkInCart()
                setInCart(true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const removeFromCart = async () => {
        try {
            const response = await removeCartBerry(id);
            if (response.status === 200) {
                // trigger checkInCart()
                setInCart(false);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleFavorite = async () => {
        try {
            if (isFavorite) {
                await client.favorite.remove({ id });
            } else {
                await client.favorite.add({ id });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            // TODO, display error message
        }
    }

    return (
        <Container>
            <Row noGutters className="align-items-center">
                <Col sm="12" md="6" className="pb-4">
                    <div className="me-4">
                        <img className="image-fluid" src={berry.image} alt="Berry product" width="100%" style={{ maxWidth: "450px" }} />
                    </div>
                </Col>
                <Col sm="0" md="6">
                    <h3>{berry.title}</h3>
                    <p>{berry.description}</p>
                    <p className="fs-2 fw-bold">{berry.price} {berry.price_currency}</p>
                    <p className="text-secondary">
                        Berries left: {berry.quantity} <br />
                        Berries weight: {berry.weight}kg
                    </p>

                    <div className="d-flex gap-1">
                        {
                            props.isAuthenticated ?
                                !inCart ?
                                    <InputGroup size="lg" style={{ width: 300 }}>
                                        <InputGroupText>
                                            <i className="bi bi-cart-plus"></i>
                                        </InputGroupText>
                                        <Input type="button" value="Add to cart"
                                            onClick={addToCart} />
                                    </InputGroup>
                                    :
                                    <InputGroup size="lg" style={{ width: 300 }}>
                                        <InputGroupText>
                                            <i className="bi bi-cart-dash"></i>
                                        </InputGroupText>
                                        <Input type="button" value="Remove from cart"
                                            onClick={removeFromCart} />
                                    </InputGroup>
                                :
                                <InputGroup size="lg" style={{ width: 300 }}>
                                    <InputGroupText>
                                        <i className="bi bi-cart-plus"></i>
                                    </InputGroupText>
                                    <Input type="button" value="Add to cart" disabled />
                                </InputGroup>
                        }
                        {
                            props.isAuthenticated
                            &&
                            <Button color="warning" size="lg" onClick={handleFavorite}>
                                {
                                    isFavorite ? <FontAwesomeIcon icon={faHeartSolid} /> : <FontAwesomeIcon icon={faHeartRegular} />
                                }
                            </Button>
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    );
}