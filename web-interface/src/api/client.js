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

    // Return list of all order with associated bills
    async list() {
        try {
            const response = await axios.get(endpoints.orders.list, {
                withCredentials: true
            });
            const orders = response.data;
            console.log("Order: ", orders);
            return await Promise.all(orders.map(async order => {
                const bill = await this.bill(order.id);
                return new Order({ ...order, bill: bill });
            }));
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
    constructor({ id = null, user = null, berries = null, bill = null}) {
        this.id = id;
        this.user = user;
        this.berries = berries || [];
        this.bill = bill;
    }
}

class Bill {
    constructor({ amount = null, currency = null, pay_url = null, status = null, create_time = null, expire_time = null}) {
        this.amount = amount;
        this.currency = currency;
        this.payUrl = pay_url;
        this.status = status;
        this.createTime = new Date(create_time);
        this.expireTime = new Date(expire_time);
    }
}

// Convenient interface for checking for status
export const StatusEnum = {
    paid: "PAID",
    waiting: "WAITING"
}