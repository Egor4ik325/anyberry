import { useState, useEffect } from "react";
import { Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Alert, Card } from "reactstrap";
import { faEllipsisV, faKiwiBird } from "@fortawesome/free-solid-svg-icons";
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
            <p>{orders ? orders.length : 0} berry orders</p>
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
                            <th className="text-center">Bill</th>
                            <th>Status</th>
                            <th>Create Time</th>
                            <th>
                                <div className="p-2">
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            <Order
                                id={20}
                                berries={[1, 2, 3, 4]}
                                bill={
                                    {
                                        amount: 10,
                                        currency: "USD",
                                        status: "EXPIRED",
                                        expireTime: new Date(2018, 11, 24, 10, 33, 30, 0),
                                        createTime: new Date(2018, 11)
                                    }
                                }
                                onReject={() => { }}
                                onError={() => { }}
                            />
                        }
                        {
                            orders && orders.map(order => <Order {...order} onReject={handleReject} onError={handleError} /> )
                        }
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
}

function Order({ id, berries, bill, onReject, onError }) {

    // Status component
    const Status = ({ status, payTime, expireTime }) => {
        const shortMonthName = new Intl.DateTimeFormat(undefined, { month: "short" }).format(expireTime);
        expireTime = `${expireTime.getDate()}/${shortMonthName}/${expireTime.getFullYear()}`

        if (status === StatusEnum.paid) {
            return (
                <div>
                    <div className="pb-1"><span className="payment-status paid">&#8729; Paid</span></div>
                    Paid on {expireTime}
                </div>
            );
        }
        if (status === StatusEnum.waiting) {
            return (
                <div>
                    <div className="pb-1"><span className="payment-status waiting">&#8729; Waiting</span></div>
                    Expires on {expireTime}
                </div>
            );
        }
        if (status === StatusEnum.expired) {
            return (
                <>
                    <div className="pb-1"><span className="payment-status expired">&#8729; Expired</span></div>
                    Expired on {expireTime}
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

    const Bill = ({ href }) => {
        return (
            <>
                <a href={href} target="_blank" rel="noreferrer" className="pay">
                    <svg viewBox="0 0 24 24" focusable="false" class="css-1nflva5" width={15}>
                        <path d="M17.783 20.125c1.525.413 3.176 1.08 5.103 3.506.196.246-.102.496-.324.296-2.217-1.995-4.082-2.56-5.926-2.638-.978-.042-1.952.054-2.968.145a57.195 57.195 0 0 1-.888.075c-.359.039-.722.06-1.09.06a9.701 9.701 0 0 1-4.867-1.285 9.328 9.328 0 0 1-3.543-3.549A9.83 9.83 0 0 1 2 11.82c0-1.763.43-3.425 1.278-4.936A9.446 9.446 0 0 1 6.781 3.3a9.342 9.342 0 0 1 4.78-1.3c1.773 0 3.43.432 4.926 1.284a9.39 9.39 0 0 1 3.554 3.56 9.832 9.832 0 0 1 1.292 4.929 10.314 10.314 0 0 1-.266 2.334 2.88 2.88 0 0 1-.088.312c-.172.558-.492 1.35-1.087 2.364-.064.107-.1.026-.108-.034-.208-1.493-.852-2.627-1.988-3.359l-.056-.035a4.94 4.94 0 0 0-.597-.317 6.056 6.056 0 0 0-.877-.312c-.192-.053-.621-.03-.466-.187.065-.065.994-.08 2.125-.007.02-.227.03-.46.03-.7 0-1.863-.607-3.382-1.856-4.644-1.25-1.262-2.711-1.876-4.468-1.876-1.798 0-3.257.615-4.458 1.88-1.209 1.27-1.795 2.776-1.795 4.604 0 1.824.603 3.324 1.845 4.586 1.242 1.261 2.684 1.875 4.408 1.875.083 0 .165-.003.241-.069-.099-1.286-.12-2.355.14-1.924.092.153.184.297.275.436a9.285 9.285 0 0 0 1.062 1.345c1.226 1.264 2.433 1.575 3.715 1.895l.082.02c.21.053.423.107.637.165zm-1.682-2.517c.099-.123.26-.192.453-.192.235 0 .48.1.692.282.427.367.558.803.331 1.112-.125.168-.33.261-.573.261-.24 0-.485-.09-.654-.24-.39-.345-.503-.905-.25-1.223zm2.183-1.674c.07-.13.211-.171.4-.115.345.164.5.69.534.947.034.25.008.448-.074.543a.166.166 0 0 1-.13.062c-.146 0-.329-.174-.545-.516-.213-.337-.29-.725-.185-.92z" fill="#fff" class="css-nt1n7y"></path>
                    </svg>
                    QIWI
                </a>
            </>
        );
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
                    <DropdownItem onClick={handleReject} className="text-danger">
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
            <td className="text-center">{bill ? <Bill href={bill.payUrl} /> : "No"}</td>
            <td>{bill ? <Status status={bill.status} expireTime={bill.expireTime} /> : "No"}</td>
            <td>{bill ? bill.createTime.toLocaleString(undefined, {month: "long", day: "numeric", year: "numeric"}) : "No"}</td>
            <th>
                {
                    bill && bill.status === StatusEnum.waiting && <EllipsisDropdown />
                }
            </th>
        </tr>
    );
}