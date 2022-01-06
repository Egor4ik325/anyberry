import { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// import { client}
import client from "../api";

export default function Orders() {
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orderObjects = await client.orders.list()
                console.log("Order objects: ", orderObjects);
                // Annotate each order with the associated bill
                setOrders(orderObjects.map(async order => {
                    const bill = await client.orders.bill(order.id);
                    order.bill = bill;
                    return order;
                }));
            } catch (error) {
                // should not be any error
                throw error;
            }
        }
        fetchOrders();
    }, [])

    const renderOrders = () => {
        return orders && orders.map(order => (
            <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.berries  ? order.berries.length : "No berries"}</td>
                <td>{order.bill ? order.bill.amount : "No bill"}</td>
                <td>?</td>
                <td>?</td>
                <td>?</td>
                <td>?</td>
                <th><FontAwesomeIcon icon={faEllipsisV} /></th>
            </tr>
        ));
    }

    return (
        <Container>
            <h2>Orders</h2>
            <p>6 berry orders</p>
            <Table color="red" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Berries</th>
                        <th>Amount</th>

                        {/* Payment status */}
                        <th>Pay</th>
                        <th>Status</th>
                        <th>Expire Time</th>

                        <th>Create Time</th>
                        <th><FontAwesomeIcon icon={faEllipsisV} color="reds-900" /></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>7</td>
                        <td>$100</td>
                        <td>https://something.com</td>
                        <td>Unpaid</td>
                        <td>Today</td>
                        <td>Tomorrow</td>
                        <th><FontAwesomeIcon icon={faEllipsisV} /></th>
                    </tr>
                    {
                        renderOrders()
                    }
                </tbody>
            </Table>
        </Container>
    );
}