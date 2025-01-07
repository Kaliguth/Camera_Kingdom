// loading component
import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";

const Loader = () => {
  // Show state of error message
  const [showMessage, setShowMessage] = useState(false);

  // Timer to show error message after 10 seconds of loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container className="custom-container">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100px" }}
      >
        <Spinner animation="border" role="status" variant="primary"></Spinner>
      </div>
      <h5>Loading...</h5>

      {showMessage && (
        // Error message
        <h6 className="text-danger">
          <b>
            This is taking longer than expected...
            <br />
            Please try again or contact support
          </b>
        </h6>
      )}
    </Container>
  );
};

export default Loader;
