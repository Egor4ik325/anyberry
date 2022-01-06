import axios from "axios";
import Cookies from "js-cookie";
import endpoints from "./endpoints";

export default class APIClient {
    orders = new Orders();
}

class Resource {

}

// Orders resource
class Orders extends Resource {

    async list() {
        try {
            const response = await axios.get(endpoints.orders.list, {
                withCredentials: true
            });
            const orders = response.data;
            console.log("Order: ", orders);
            return orders.map(order => new Order(order));
        } catch (error) {
            // Should not be any API-related errors (based on user input)
            throw error;
        }
    }

    async bill(id) {
        try {
            const response = await axios.get(endpoints.orders.bill(id), {
                withCredentials: true
            });
            return new Bill(response.data);
        } catch (error) {
            // Should not be any API-related errors (based on user input)

            // If bill for order accidentally not exists
            if (error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async reject(id) {
        const csrftoken = Cookies.get("csrftoken");
    }
}

// Order resource object
class Order {
    constructor({ id = null, user = null, berries = null}) {
        this.id = id;
        this.user = user;
        this.berries = berries || [];
        this.bill = null;
    }
}

class Bill {
    constructor({ amount = null, currency = null, pay_url = null, status = null, create_time = null, expire_time = null}) {
        this.amount = amount;
        this.currency = currency;
        this.payUrl = pay_url;
        this.status = status;
        this.createTime = create_time;
        this.expireTime = expire_time;
    }
}