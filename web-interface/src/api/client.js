import axios from "axios";
import Cookies from "js-cookie";
import endpoints from "./endpoints";
import { APIError, RejectTaskFailureError, RejectTaskNotSucceeded } from "./exceptions";

export default class APIClient {
    orders = new Orders();
    tasks = new Tasks();
    favorite = new Favorite();

    constructor() {
        const newLocal = this;
        // Reference the tasks API for orders API
        this.orders.tasks = this.tasks;
    }
}

// Provide some common to all resources methods (with default)
class Resource {
    async _request(config) {
        // If safe method
        if (config.method === "get") {
            return axios({ ...config, withCredentials: true });
        } else {
            return axios({ ...config, withCredentials: true, xsrfCookieName: "csrftoken", xsrfHeaderName: "x-csrftoken" });
        }
    }
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

        try {
            const response = await axios.post(endpoints.orders.reject(id), null, {
                withCredentials: true,
                headers: {
                    "x-csrftoken": csrftoken
                }
            });
            const rejectResponse = new RejectResponse(response.data);

            // If no bill (task id is null) simply return from function
            if (rejectResponse.taskId === null) {
                return;
            }

            // Check reject order bill succeeded (5 times 5 second interval)
            try {
                let i = 0;
                const intervalId = setInterval(async () => {
                    if (i === 5) {
                        window.clearInterval(intervalId);
                        throw new RejectTaskNotSucceeded();
                    }

                    const taskResponse = await this.tasks.detail(rejectResponse.taskId, { withCredentials: true });
                    const taskResult = new Task(taskResponse.data);

                    if ([TaskStatusEnum.pending, TaskStatusEnum.started, TaskStatusEnum.retry].includes(taskResult.status)) {
                        return;
                    } else if (taskResult.status === TaskStatusEnum.failure) {
                        throw new RejectTaskFailureError();
                    } else if (taskResult.status === TaskStatusEnum.success) {
                        // Stop interval and return
                        window.clearInterval(intervalId);
                        return; 
                    }
                }, 5_000);

                return; // if success full just return (without raising anything)
            } catch (error) {
                // If can not check the status of rejecting order bill => reject is not successful
                throw error;
            }

        } catch (error) {
            // should not be any API errors
            throw error;
        }
    }
}

// Favorite berries list resource
class Favorite extends Resource {
    // Return the list of berry ids in the list
    async list() {
        try {
            const response = await this._request({ url: endpoints.favorite.list });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Add berry to the list, on failure return/raise error/exception
    async add({ id }) {
        try {
            const response = await this._request({ method: "post", url: endpoints.favorite.list, data: { berry: id } });
        } catch (error) {
            // Berry may not exists, but user can not add arbitrary berries (if it is not deleted at the time of add)
            if (error.response) {
                // Return and error with the message formatted with data from error response
                // to differentiate API-related error from generic language errors it will be custom exception class
                const apiError = new APIError();
                apiError.message = `Error: adding to favorite list`;

                // if response include error detail => append to message
                if (error.response.detail) {
                    apiError.message += `: ${error.message.detail}`;
                }

                throw apiError;
            }

            throw error;
        }
    }

    // Clear should be always successful
    async clear() {
        const response = await this._request({ method: "delete", url: endpoints.favorite.list });
    }

    // On success void return otherwise raise exception object
    async remove({ id }) {
        try {
            this._request({ method: "delete", url: endpoints.favorite.detail(id) })
        } catch (error) {
            if (error.response) {
                const apiError = new APIError();
                apiError.message = `Error removing berry: ${error.response.detail || "no detail"}`;
                throw apiError;
            }

            throw error;
        }
    }
}

class Tasks extends Resource {
    async detail(id) {
        try {
            const response = await axios.get(endpoints.tasks.detail, { withCredentials: true });
            return Task(response.data);
        } catch (error) {
            // should not be any errors if task exists (i.e. no bill)
            throw error;
        }
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
    waiting: "WAITING",
    expired: "EXPIRED"
}

class RejectResponse {
    constructor({ reject_bill_task_id }) {
        this.taskId = reject_bill_task_id;
    }
}

// Represent asynchronous task action
class Task {
    constructor({ id, status, date_done, result }) {
        this.id = id;
        this.status = status;
        this.dateDone = date_done;
        this.result = result;
    }
}

class TaskStatusEnum {
    pending = "PENDING";
    started = "STARTED";
    retry = "RETRY";
    failure = "FAILURE";
    success = "SUCCESS";
}