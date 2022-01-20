// Design
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faMoneyBillAlt,
} from "@fortawesome/free-solid-svg-icons";

// Assets
import berryBasket from "../assets/img/photos/berries.jpg";
import blueberryBackground from "../assets/img/photos/blueberry.jpg";

import cranberry from "../assets/img/photos/cranberry.jpg";
import elderberry from "../assets/img/photos/elderberry.jpg";
import mulberry from "../assets/img/photos/mulberry.jpg";
import gooseberry from "../assets/img/photos/gooseberry.jpg";
import lingonberry from "../assets/img/photos/lingonberry.jpg";

import strawberryPattern from "../assets/img/photos/strawberry-pattern.jpg";

const Hero = ({ className, style }) => (
  <div
    className={
      className + " d-flex flex-lg-row-reverse flex-column  gap-0 gap-md-4"
    }
    style={style}
  >
    <img
      className="landing-hero-photo w-100 img-fluid ms-xl-5 mb-5 mb-lg-0 align-self-center"
      alt="basket of berries"
      src={berryBasket}
    />
    <div className="d-flex flex-column text-center text-lg-start align-self-center">
      <h1 className="landing-heading mb-4">Any berry that you like</h1>
      <p
        className="landing-hero-paragraph mb-5 px-3 px-lg-0"
        style={{ fontSize: "1rem", lineHeight: 1.6 }}
      >
        Anyberry lets your explore, buy and taste berries from all around the
        planet. We provide fastest delivery and customer support all the time.
        Go ahead and order some nice, fresh and tasty wild berries.
      </p>
      <div>
        <Button
          tag={"a"}
          href="/berries"
          color="danger"
          size="lg"
          className="px-4 py-2 btn-block fw-lighter"
          style={{ borderRadius: 25 }}
        >
          Explore Berries
        </Button>
      </div>
    </div>
  </div>
);

const Contents = () => (
  <div
    className="landing-contents d-flex flex-column align-items-center justify-content-center text-center text-white"
    style={{
      // backgroundColor: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))",
      backgroundImage: `url(${blueberryBackground})`,
      backgroundColor: "rgba(0, 0, 0, .4)",
      backgroundRepeat: "no-repeat",
      backgroundBlendMode: "darken",
    }}
  >
    <h1 className="mt-3 mb-5 px-md-5 fw-bolder">
      The Most Popular and Proven E-commerce Website
      <br className="d-none d-md-inline" /> For True Connoisseurs of Berries
    </h1>
    <p className="landing-p fs-5">
      Throughout the history of our business, we have established high-quality
      and proven supplies of berries.
      <br className="landing-p-br" />
      You can find almost any berries filtered by type, color and origin on
      Anyberry.
      <br className="landing-p-br" />
      Our popularity and quality are our major distinguishing qualities.
    </p>

    {/* Unique.
        Any kind, color, location.
        Low price. */}
  </div>
);

const Features = ({ style }) => (
  <div className="landing-features text-center align-center" style={style}>
    <div className="pb-3">
      <h1 className="landing-heading mb-3">Customer Experience</h1>
      <p className="landing-paragraph mb-5">
        Enjoy a pleasant and thoughtful user interface, get the best experience
        of buying berries around the world.
      </p>
    </div>
    <Row className="gap-2 gap-lg-0">
      <Col lg={4} xs={12}>
        <Card className="h-100 border-1">
          <CardBody>
            <FontAwesomeIcon
              className="landing-features-icon"
              icon={faShoppingCart}
              style={{ fontSize: "2.5rem" }}
            />
            <h4>Shopping Cart</h4>
            <div className="card-paragraph">
              Add berries you like to the cart for further purchase.
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={4} xs={12}>
        <Card className="h-100">
          <CardBody>
            <FontAwesomeIcon
              className="landing-features-icon"
              icon={faHeart}
              style={{ fontSize: "2.5rem" }}
            />
            <h4>Favorite List</h4>
            <div className="card-paragraph">
              Add most favorite berries to the list and buy the later in
              seconds.
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={4} xs={12}>
        <Card className="h-100">
          <CardBody>
            <FontAwesomeIcon
              className="landing-features-icon"
              icon={faMoneyBillAlt}
              style={{ fontSize: "2.5rem" }}
            />
            <h4>Fast Payments</h4>
            <div className="card-paragraph">
              All payments are secured and handled by QIWI. Bill expire in a
              month thought that you can order berries before the will run out.
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </div>
);

const Products = () => (
  <div className="text-center mt-5">
    <div className="mb-5 pb-3">
      <h1 className="landing-heading mb-3">Featured Products</h1>
      <p className="landing-paragraph mb-4">Taste every berry in the world.</p>
      <Button
        tag={"a"}
        href="/berries"
        className="px-4 py-2 btn-block fw-lighter"
        style={{ backgroundColor: "black", borderRadius: 25 }}
      >
        Show Now
      </Button>
    </div>

    {/* Image grid should be at max height 500px */}
    <Row>
      <Col xs={12} md={6} lg={4}>
        <Row className="landing-product">
          <img src={cranberry} className="landing-product-img" />
          <div className="landing-product-desc">
            <div>Cranberry</div>
            Cranberries are a sour-tasting type of red berry that are rich in
            vitamin C and are packed with fiber and antioxidants.
          </div>
        </Row>
        <Row>
          <img
            src={elderberry}
            className="landing-product landing-product-img"
          />
        </Row>
      </Col>
      <Col xs={12} md={6} lg={4} className="px-sm-0">
        <img src={mulberry} className="landing-product landing-product-img-2" />
      </Col>
      <Col xs={12} lg={4}>
        <Row>
          <Col xs={12} md={6} lg={12}>
            <Row>
              <img
                src={gooseberry}
                className="landing-product landing-product-img"
              />
            </Row>
          </Col>
          <Col xs={12} md={6} lg={12} className="px-4 px-lg-3 px-sm-2">
            <Row>
              <img
                src={lingonberry}
                className="landing-product landing-product-img"
              />
            </Row>
          </Col>
        </Row>
        {/* <Row>

        </Row> */}
      </Col>
    </Row>

    <div>Elderberry</div>
    <div>Mulberry</div>
    <div>Gooseberry</div>
    <div>Lingonberry</div>
  </div>
);

const CallToAction = () => <>Sign-up now.</>;

// E-commerce berry shop landing page
const Landing = () => {
  return (
    <>
      <Container>
        <Hero
          className="py-5 pt-0 pt-lg-5"
          style={{ marginTop: "5rem", marginBottom: "8rem" }}
        />
      </Container>
      <Contents />
      <Container>
        <Features style={{ marginTop: "80px", marginBottom: "80px" }} />
        <hr />
        <Products />
      </Container>
    </>
  );
};

export default Landing;
