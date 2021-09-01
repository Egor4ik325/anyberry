import React from "react";
import { Navbar, Container, Nav, NavItem, NavLink } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import logo from "./logo.png";

// Header = Navbar (Container) or Nav (Container)
function Header(props) {
    return (
        <Navbar color="dark" dark expand="md" fixed className="mb-4">
            <Container fluid className="d-flex justify-content-start mx-4">
                <Link to="/"
                    className="d-flex justify-content-center align-items-center text-decoration-none text-light">
                    <img src={logo} alt="Anyberry logo" width="32" className="pb-1" />
                    <span className="fs-4 fw-bold pb-1 px-2">Anyberry</span>
                </Link>
                <Nav>
                    <NavItem>
                        <Link className="nav-link text-light" to="/about">About</Link>
                    </NavItem>
                    <NavItem>
                        <Link className="nav-link text-light" to="/contact">Contact</Link>
                    </NavItem>
                    <NavItem>
                        <Link className="nav-link text-light" to="/account">Account</Link>
                    </NavItem>
                </Nav>
            </Container>
        </Navbar >
    );
}

export default withRouter(Header);