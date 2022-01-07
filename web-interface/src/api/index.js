/*
 * The interface to the API client will be:
 * APIClient(token).orders.list()
 */
import APIClient, { StatusEnum } from "./client";
const client = new APIClient();
export default client;
export { StatusEnum } from "./client";