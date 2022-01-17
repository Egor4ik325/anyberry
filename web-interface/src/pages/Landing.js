
// Design
import {
    Container, Button,
    Row, Col, Card, CardHeader, CardBody,
} from "reactstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart, faMoneyBillAlt } from "@fortawesome/free-solid-svg-icons";

// Assets
import berryBasket from "../assets/img/photos/berries.jpg";
import blueberryBackground from "../assets/img/photos/blueberry.jpg";

const Hero = ({ className, style }) => (
    <div className={className + " d-flex flex-lg-row-reverse flex-column  gap-0 gap-md-4"} style={style}>
        <img className="landing-hero-photo w-100 img-fluid ms-xl-5 mb-5 mb-lg-0 align-self-center" alt="basket of berries" src={berryBasket} />
        <div className="d-flex flex-column text-center text-lg-start align-self-center">
            <h1 className="landing-heading mb-4">Any berry that you like</h1>
            <p className="landing-hero-paragraph mb-5 px-3 px-lg-0" style={{fontSize: "1rem", lineHeight: 1.6}}>
                Anyberry lets your explore, buy and taste berries from all around the planet.
                We provide fastest delivery and customer support all the time.
                Go ahead and order some nice, fresh and tasty wild berries.
            </p>
            <div>
                <Button tag={"a"} href="/berries" color="danger" size="lg" className="px-4 py-2 btn-block fw-lighter" style={{ borderRadius: 25 }}>
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
            The Most Popular and Proven E-commerce Website<br className="d-none d-md-inline" /> For True Connoisseurs of Berries
        </h1>
        <p className="landing-p fs-5">
            Throughout the history of our business, we have established high-quality and proven supplies of berries.
            <br className="landing-p-br" />
            You can find almost any berries filtered by type, color and origin on Anyberry.
            <br className="landing-p-br" />
            Our popularity and quality are our major distinguishing qualities.
        </p>

        {/* Unique.
        Any kind, color, location.
        Low price. */}
    </div>
);

const Features = () => (
    <div className="landing-features text-center">
        <div>
            <h1 className="landing-heading">Customer Experience</h1>
            <p className="landing-paragraph">Enjoy a pleasant and thoughtful user interface, get the best experience of buying berries around the world.</p>
        </div>
        <Row>
            <Col>
                <Card>
                    <CardBody>
                        <FontAwesomeIcon className="landing-features-icon" icon={faShoppingCart} style={{fontSize: "2.5rem"}} />
                        <h3>Shopping Cart</h3>
                        Add berries you like to the cart for further purchase.
                    </CardBody>
                </Card>
            </Col>
            <Col>
                <Card>
                    <CardBody>
                        <FontAwesomeIcon className="landing-features-icon" icon={faHeart} style={{fontSize: "2.5rem"}} />
                        <h3>Favorite List</h3>
                        Add most favorite berries to the list and buy the later in seconds.
                    </CardBody>
                </Card>
            </Col>
            <Col>
                <Card>
                    <CardBody>
                        <FontAwesomeIcon className="landing-features-icon" icon={faMoneyBillAlt} style={{fontSize: "2.5rem"}} />
                        <h3>Fast Payments</h3>
                        All payments are secured and handled by QIWI.
                        Bill expire in a month thought that you can order berries before the will run out.
                    </CardBody>
                </Card>
            </Col>
        </Row>


    </div>
);

const Products = () => (
    <>
        Blackberry.
        Whiteberry.
        Gooseberry.
    </>
);

const CallToAction = () => (
    <>
        Sign-up now.
    </>
);

// E-commerce berry shop landing page
const Landing = () => {
    return (
        <>
            <Container>
                <Hero className="py-5 pt-0 pt-lg-5" style={{marginTop: "5rem", marginBottom: "8rem"}} />
            </Container>
            <Contents />
            <Container>
                <Features />
                <Products />
            </Container>
        </>
    );
};

export default Landing;