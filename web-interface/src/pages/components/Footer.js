import React from "react";

import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <Container
      tag={"footer"}
      fluid
      className="mt-auto pt-2 pb-4 text-white bg-dark"
    >
      <Row>
        <Col
          xs={12}
          md={5}
          className="text-center text-md-start fs-5 fw-bolder my-auto"
        >
          Anyberry
        </Col>
        <Col
          xs={12}
          md={2}
          className="text-center fst-italic mb-3 mb-md-0 d-flex justify-content-center align-items-center"
        >
          Since 1985
        </Col>
        <Col
          xs={12}
          md={5}
          className="d-flex justify-content-center justify-content-md-end align-items-center fw-lighter"
        >
          &copy; 2022 Anyberry. All rights reserved.
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
