import axios from "axios";
import Cookies from "js-cookie";

import { CART_URL } from "./constants";


export const getCartBerries = async () => {
    try {
        const response = await axios.get(CART_URL, { withCredentials: true });
        const berries = response.data;
        return berries;
    } catch (errors) {
        console.error("Get cart berries error: ", errors);
        return null;
    }
}

export const addCartBerry = async id => {
    try {
        const csrftoken = Cookies.get('csrftoken');
        const response = await axios.post(CART_URL + `${id}/`, null, {
            withCredentials: true,
            headers: {
                'X-CSRFTOKEN': csrftoken
            }
        });
        return response;
    } catch (errors) {
        console.error("Add cart berry error: ", errors);
        return null;
    }
}

export const removeCartBerry = async id => {
    try {
        const csrftoken = Cookies.get('csrftoken');
        const response = await axios.delete(CART_URL + `${id}/`, {
            withCredentials: true,
            headers: {
                'X-CSRFTOKEN': csrftoken
            }
        });
        return response;
    } catch (errors) {
        console.error("Remove cart berry error: ", errors);
        return null;
    }
}

export const clearCart = async () => {
    try {
        const csrftoken = Cookies.get('csrftoken');
        const response = await axios.delete(CART_URL, {
            withCredentials: true,
            headers: {
                'X-CSRFTOKEN': csrftoken
            }
        });
        return response;
    } catch (errors) {
        console.error("Clear cart error: ", errors);
        return null;
    }
}