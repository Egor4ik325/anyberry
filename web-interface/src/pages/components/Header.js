import React from "react";
import { Navbar, Container, Nav, NavItem } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import logo from "./logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"

// Header = Navbar (Container) or Nav (Container)
function Header(props) {
    const { isAuthenticated } = props;
    return (
        <Navbar color="dark" dark expand="md" className="mb-4">
            <Container fluid className="d-flex justify-content-start mx-4">
                <Link to="/"
                    className="d-flex justify-content-center align-items-center text-decoration-none text-light">
                    <img src={logo} alt="Anyberry logo" width="32" className="pb-1" />
                    <span className="fs-4 fw-bold pb-1 px-2">Anyberry</span>
                </Link>
                <Nav className="me-auto">
                    <NavItem>
                        <Link className="nav-link text-light" to="/about">About</Link>
                    </NavItem>
                    <NavItem>
                        <Link className="nav-link text-light" to="/contact">Contact</Link>
                    </NavItem>
                    {
                        isAuthenticated &&
                        <>
                            <NavItem>
                                <Link className="nav-link text-light" to="/account">Account</Link>
                            </NavItem>
                            <NavItem>
                                <Link className="nav-link text-light" to="/cart">Cart</Link>
                            </NavItem>
                        </>
                    }
                </Nav>
                {
                    !props.isAuthenticated ?
                        <>
                            <Link className="btn btn-outline-light me-2" to="/login">Log-in</Link>
                            <Link className="btn btn-danger" to="/signup">Sign-up</Link>
                        </>
                        :
                        <>
                            <Link className="btn btn-outline-light" to="/Logout">Logout</Link>
                        </>
                }
            </Container>
        </Navbar >
    );
}

export default withRouter(Header);