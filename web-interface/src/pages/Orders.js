import { useState, useEffect } from "react";
import { Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Alert } from "reactstrap";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// import { client}
import client, { StatusEnum } from "../api";
import { APIError } from "../api/exceptions";

export default function Orders() {
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState(null);

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
    }, []) // fetch on startup

    // Remove order from the list
    const handleReject = (id) => {
        setOrders(orders.filter(item => item.id !== id));
    }

    const handleError = (error) => {
        setError(error);
    }

    return (
        <Container>
            <h2>Orders</h2>
            <p>6 berry orders</p>
            
            {
                // Display error message
                error &&
                <Alert color="danger" className="alert-dismissible">
                    {error.message}
                    <button className="btn btn-close" onClick={() => setError(null)} />
                </Alert>
            }

            <Table>
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
                            <div className="p-2">
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </div>
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
                            x
                        </th>
                    </tr>
                    {
                        orders && orders.map(order => <Order {...order} onReject={handleReject} onError={handleError} /> )
                    }
                </tbody>
            </Table>
        </Container>
    );
}

function Order({ id, berries, bill, onReject, onError }) {

    const Status = ({ status }) => {
        if (status === StatusEnum.paid) {
            return "Paid";
        }
        if (status === StatusEnum.waiting) {
            return "Waiting";
        }

        return "Other";
    }

    const handleReject = async () => {
        try {
            const response = await client.orders.reject(id);

            // Remove order from the list
            onReject(id);
        } catch (error) {
            if (error instanceof APIError) {
                // Display an error message
                onError(error);
            }
            
            throw error;
        }
    }

    const EllipsisDropdown = () => {
        const [open, setOpen] = useState(false);
        return (
            <Dropdown isOpen={open} toggle={() => { }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                <DropdownToggle tag={"div"} className="p-2">
                    <FontAwesomeIcon icon={faEllipsisV} />
                </DropdownToggle>

                <DropdownMenu right onMouseEnter={() => setOpen(true)} onMouseLeave={() => !open && setOpen(false)}>
                    <DropdownItem onClick={handleReject}>
                        Reject
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }

    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{berries  ? berries.length : "No"}</td>
            <td>{bill ? `${bill.currency}${bill.amount}` : "No"}</td>
            <td>{bill ? <a href={bill.payUrl} target="_blank" rel="noreferrer">QIWI</a> : "No"}</td>
            <td>{bill ? <Status status={bill.status} /> : "No"}</td>
            <td>{bill ? bill.expireTime.toDateString() : "No"}</td>
            <td>{bill ? bill.createTime.toDateString() : "No"}</td>
            <th>
                <EllipsisDropdown />
            </th>
        </tr>
    );
}