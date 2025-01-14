import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import error404 from "../assets/Error404.png";
import HomeButtons from "../components/utility/HomeButtons";

// Error 404 page
const Error404Page = () => {
  return (
    <Container className="custom-container mt-4">
      <Row>
        <h1 className="display-3 text-danger" style={{ letterSpacing: "5px" }}>
          ERROR 404
        </h1>
        <h2 className="display-5">Page Not Found</h2>
      </Row>

      <Row className="m-4">
        <Col>
          <Image src={error404} alt="Error 404" className="error-404-image" />
        </Col>
      </Row>

      <Row className="m-4">
        <h5 className="text-muted">
          The page you are looking for does not exist or has been moved.
        </h5>
      </Row>

      <HomeButtons size={"lg"} />
    </Container>
  );
};

export default Error404Page;
