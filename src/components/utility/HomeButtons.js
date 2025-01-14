import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Component of home and back buttons displayed in various places around the app
const HomeButtons = ({ size }) => {
  const navigate = useNavigate();

  return (
    <Row className="mt-4 hide-on-print">
      <Col>
        <Button
          className="custom-button"
          variant="secondary"
          size={size === "md" ? "md" : "lg"}
          onClick={() => navigate(-1)}
        >
          Go back
        </Button>
        <Button
          className="custom-button"
          variant="primary"
          size={size === "md" ? "md" : "lg"}
          onClick={() => navigate("/")}
        >
          Home
        </Button>
      </Col>
    </Row>
  );
};

export default HomeButtons;
