import React from "react";
// import axios from "axios";
import { Container, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useEffect } from "react/cjs/react.development";
import { Link } from "react-router-dom";

// import { USER_URL, CART_URL } from "../Constants";

import { getCartBerries, removeCartBerry } from "../api/Cart";
import { getBerry } from "../api/Berry";
import { clearCart } from "../api/Cart";

export default function Cart(props) {
    const [cart, setCart] = React.useState(null);
    const { isAuthenticated } = props;

    // Show modal flag
    const [modal, setModal] = React.useState(false);
    const toggle = () => setModal(!modal);

    // async function getCurrentUser() {
    //     const res = await axios.get(USER_URL, {
    //         withCredentials: true
    //     })
    //         .catch(err => {
    //             // Network error
    //             console.error("Request error: ", err);
    //             return null;
    //         });

    //     if (res.ok) {
    //         return res.data;
    //     }
    //     return null;
    // }

    // async function fetchCart() {
    //     const user = await getCurrentUser();
    //     if (user) {
    //         axios.get(`${CART_URL}/${user.id}/`, {
    //             withCredentials: true
    //         })
    //             .then(res => {
    //                 if (res.ok) {
    //                     setCart(JSON.stringify(res.data));
    //                 }
    //             })
    //             .catch(err => {
    //                 console.error(err);
    //             });
    //     }
    // }

    const fetchCart = async _ => {
        const berries = await getCartBerries();
        const fullBerries = await Promise.all(berries.map(async berry => await getBerry(berry)));
        setCart(fullBerries);
    }

    useEffect(() => {
        fetchCart();
    }, [setCart]);

    const renderCart = () => {
        if (cart) {
            const berries = cart.map(berry =>
                <li key={berry.id}>{berry.title} <Button close onClick={() => handleBerryRemove(berry.id)}></Button></li>
            );
            return <ul>{berries}</ul>;
        }
    }

    async function handleClearCart() {
        toggle();
        try {
            const res = await clearCart();
            if (res.status === 200) {
                // trigger cart fetching
                fetchCart();
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleBerryRemove = async id => {
        try {
            const res = await removeCartBerry(id);
            if (res.status === 200) {
                // trigger cart fetching
                setCart(undefined);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Container>
            <h1>Shopping cart</h1>
            <Button color="danger" onClick={toggle}>Clear the cart</Button>
            {renderCart()}
            {
                isAuthenticated ?
                    cart ? <p>Have fetched.</p> : <p>You have no berries in the cart!</p>
                    :
                    <p>Sorry you are not authenticated, go to the <Link to="/login">login</Link> page</p>
            }
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Are you sure you want clear the whole cart?</ModalHeader>
                <ModalBody className="d-flex justify-content-between">
                    <Button color="primary" className="w-50 m-1" onClick={handleClearCart}>Yes</Button>
                    <Button color="secondary" className="w-50 m-1" onClick={toggle}>No</Button>
                </ModalBody>
            </Modal>
        </Container>
    );
}