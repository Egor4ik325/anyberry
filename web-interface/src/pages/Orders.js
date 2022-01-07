import { useState, useEffect } from "react";
import { Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { faBorderNone, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// import { client}
import client, { StatusEnum } from "../api";

export default function Orders() {
    const [orders, setOrders] = useState(null);
    const [open, setOpen] = useState(false);
    // const []

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orderObjects = await client.orders.list()
                console.log("Order objects: ", orderObjects);
                setOrders(orderObjects);
            } catch (error) {
                // should not be any error
                throw error;
            }
        }
        fetchOrders();
    }, [])

    const handleMouseOut = (e) => {
        // TODO
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
                        <th>
                            <FontAwesomeIcon icon={faEllipsisV} color="reds-900" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={1}>
                        <td>1</td>
                        <td>7</td>
                        <td>$100</td>
                        <td>https://something.com</td>
                        <td>Unpaid</td>
                        <td>Today</td>
                        <td>Tomorrow</td>
                        <th>
                            <Dropdown isOpen={open} onMouseOver={() => setOpen(true)}>
                                {/* Toggler */}
                                <DropdownToggle>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </DropdownToggle>
                                <DropdownMenu right onMouseOver={() => setOpen(true)}>
                                    <DropdownItem>
                                        Hello
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </th>
                    </tr>
                    {
                        orders && orders.map(order => <Order {...order} /> )
                    }
                </tbody>
            </Table>
        </Container>
    );
}

function Order({ id, berries, bill }) {
    const Status = ({ status }) => {
        console.log("Status: ", status);
        if (status === StatusEnum.paid) {
            return "Paid";
        }
        if (status === StatusEnum.waiting) {
            return "Waiting";
        }

        return "Other";
    }

    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{berries  ? berries.length : "No"}</td>
            <td>{bill ? `${bill.currency}${bill.amount}` : "No"}</td>
            <td>{bill ? <a href="bill.payUrl">QIWI</a> : "No"}</td>
            <td>{bill ? <Status status={bill.status} /> : "No"}</td>
            <td>{bill ? bill.expireTime.toDateString() : "No"}</td>
            <td>{bill ? bill.createTime.toDateString() : "No"}</td>
            <th><FontAwesomeIcon icon={faEllipsisV} /></th>
        </tr>
    );
}