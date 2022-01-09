import { useState, useEffect } from "react";
import { Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Alert, Card } from "reactstrap";
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

            <Card class="rounded-4">
                <Table
                    hover responsive
                    className="m-1"
                >
                    <thead className="text-uppercase fw-normal text-danger">
                        <tr className="table-light">
                            <th>#</th>
                            <th>Berries</th>
                            <th className="text-end">Amount</th>

                            {/* Payment status */}
                            <th>Pay</th>
                            <th>Status</th>
                            <th>Expire Time</th>

                            <th>Create Time</th>
                            <th>
                                <div className="p-2">
                                    <FontAwesomeIcon icon={faEllipsisV} color="rgb(241, 26, 39)" />
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
                        {
                            <Order id={20} berries={[1, 2, 3, 4]} bill={{amount: 10, currency: "USD", status: "EXPIRED", expireTime: new Date(2018, 11, 24, 10, 33, 30, 0), createTime: new Date(2018, 11)}} onReject={() => {}} onError={() => {}} />
                        }
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
}

function Order({ id, berries, bill, onReject, onError }) {

    // Status component
    const Status = ({ status, expireTime }) => {
        if (status === StatusEnum.paid) {
            return (
                <div>
                    <div className="pb-1"><span className="payment-status paid">&#8729; Paid</span></div>
                    Paid on 15/APR/2020
                </div>
            );
        }
        if (status === StatusEnum.waiting) {
            return (
                <div>
                    <div className="pb-1"><span className="payment-status waiting">&#8729; Waiting</span></div>
                    Expires on 15/APR/2020
                </div>
            );
        }
        if (status === StatusEnum.expired) {
            return (
                <>
                    <div className="pb-1"><span className="payment-status expired">&#8729; Expired</span></div>
                    Expired on 15/APR/2020
                </>
            );
        }

        return "Other";
    }

    const Amount = ({ amount, currency }) => {
        amount = Number(amount);
        return (
            <>
                <div className="text-end">
                    {/* Convert to locale (i18n) string (based on system locale) */}
                    <div className="fs-6">{amount.toLocaleString(undefined, { style: "currency", currency: currency})}</div>
                    <div className="text-muted">{currency}</div>
                </div>
            </>
        );
    }

    const PayLink = () => {

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
            <Dropdown
                isOpen={open}
                toggle={() => { }}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <DropdownToggle tag={"div"} className="p-2">
                    <FontAwesomeIcon icon={faEllipsisV} />
                </DropdownToggle>

                <DropdownMenu
                    right onMouseEnter={() => setOpen(true)} onMouseLeave={() => !open && setOpen(false)}
                    className="shadow"
                >
                    <DropdownItem onClick={handleReject} className="text-danger m-1">
                        Reject
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }

    return (
        <tr key={id} className="align-middle">
            <td>{id}</td>
            <td>{berries  ? berries.length : "No"}</td>
            <td>{bill ? <Amount amount={bill.amount} currency={bill.currency} /> : "No"}</td>
            <td>{bill ? <a href={bill.payUrl} target="_blank" rel="noreferrer">QIWI</a> : "No"}</td>
            <td>{bill ? <Status status={bill.status} expireTime={bill.expireTime} /> : "No"}</td>
            <td>{bill ? bill.expireTime.toDateString() : "No"}</td>
            <td>{bill ? bill.createTime.toDateString() : "No"}</td>
            <th>
                {
                    bill && bill.status === StatusEnum.waiting && <EllipsisDropdown />
                }
            </th>
        </tr>
    );
}