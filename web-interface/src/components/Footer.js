import React from "react";
import { Container } from "reactstrap";

const Footer = () => {
    return (
        <div className="footer">
            <footer className="py-3 bg-dark fixed-bottom">
                <Container>
                    <p className="text-center text-white">Since 1985</p>
                </Container>
            </footer>
        </div>
    );
}

export default Footer;