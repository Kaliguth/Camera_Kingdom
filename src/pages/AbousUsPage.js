import React from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_small.png";

const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="custom-container mt-3">
      <Row className="mb-4">
        <Col>
          <Image src={logo} roundedCircle width={100} height={100} />
          <h1>Welcome to Camera Kingdom</h1>
          <h5>
            <b>Capture every moment!</b>
          </h5>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="order-container mb-4">
            <Row>
              <h3>
                <b>
                  <u>About Us</u>
                </b>
              </h3>
            </Row>

            <Row className="ms-4 me-4">
              <p style={{ fontSize: "1.1rem" }}>
                Camera Kingdom is more than just an online store—it's a
                community of passionate photographers and camera enthusiasts.
                Our platform allows customers to engage with products through
                likes and reviews, helping you make informed decisions. You can
                also create a wishlist to keep track of your favorite items. Our
                dedicated team of professionals is always available to assist
                you with any queries, ensuring top-notch customer service.
                <br />
                <br />
                We take pride in offering an extensive variety of cameras,
                accessories, and equipment, all at competitive prices. Our
                regular sales events and available coupons make it even easier
                for you to find great deals. Whether you’re a seasoned pro or a
                budding photographer, Camera Kingdom is here to provide you with
                the best products and an easy shopping experience.
                <br />
                <br />
                So what are you waiting for?
                <br />
                Get your Camera Kingdom products and CAPTURE EVERY MOMENT! :)
              </p>
            </Row>

            <Col>
              <Button
                variant="success"
                size="lg"
                className="m-4"
                onClick={() => navigate("/categories")}
              >
                Start shopping!
              </Button>
            </Col>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUsPage;
