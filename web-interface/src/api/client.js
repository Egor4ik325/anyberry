import axios from "axios";
import Cookies from "js-cookie";
import endpoints from "./endpoints";
import { RejectTaskFailureError, RejectTaskNotSucceeded } from "./exceptions";

export default class APIClient {
    orders = new Orders();
    tasks = new Tasks();

    constructor() {
        const newLocal = this;
        // Reference the tasks API for orders API
        this.orders.tasks = this.tasks;
    }
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