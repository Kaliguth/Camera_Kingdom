import React from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_small.png";

const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="custom-container">
      <Container className="mt-4">
        {/* Welcome and Featured Products */}
        <Row className="mb-4">
          <Col>
            <Image src={logo} roundedCircle width={100} height={100} />
            <h1>Welcome to Camera Kingdom</h1>
            <h5><b>Capture every moment!</b></h5>
          </Col>
        </Row>
      </Container>

      <Container className="mb-5">
        <Row className="justify-content-center">
          <Col
            md={8}
            className="text-center"
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
            }}
          >
            <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>
              About Us
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#6c757d" }}>
              Camera Kingdom is more than just an online store—it's a community
              of passionate photographers and camera enthusiasts. Our platform
              allows customers to engage with products through likes and
              reviews, helping you make informed decisions. You can also create
              a wishlist to keep track of your favorite items. Our dedicated
              team of professionals is always available to assist you with any
              queries, ensuring top-notch customer service.
              <br />
              <br />
              We take pride in offering an extensive variety of cameras,
              accessories, and equipment, all at competitive prices. Our regular
              sales events and available coupons make it even easier for you to
              find great deals. Whether you’re a seasoned pro or a budding
              photographer, Camera Kingdom is here to provide you with the best
              products and an easy shopping experience.
              <br />
              <br />
              So what are you waiting for?
              <br />
              Get your Camera Kingdom products while they last! :)
            </p>
            <Button
              variant="success"
              size="lg"
              className="m-4"
              onClick={() => navigate("/categories")}
            >
              Start shopping!
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default AboutUsPage;
