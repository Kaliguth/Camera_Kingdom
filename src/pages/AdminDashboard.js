import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import Loader from "../components/utility/Loader";
import Error404 from "../assets/Error404.png";
import HomeButtons from "../components/utility/HomeButtons";

const AdminDashboard = () => {
  const { currentUser, userData, userLoading } = useAuthContext();
  const navigate = useNavigate();

  if (userLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Container>
        <Row className="m-4">
          <Col>
            <Image src={Error404} alt="Error 404" className="error-404-image" />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <p>Must be logged in to view this page</p>
            <p>
              <b>ADMINS ONLY!</b>
            </p>
            <Button
              variant="success"
              size="lg"
              className="custom-button"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            {/* <Button
              className="custom-button btn-md"
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>
            <Button
              className="custom-button btn-md"
              onClick={() => navigate("/")}
            >
              Home
            </Button> */}
            <HomeButtons size={"md"} />
          </Col>
        </Row>
      </Container>
    );
  }

  if (!userData.isAdmin) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <p>You do not have admin privileges</p>
            {/* <Button
              className="custom-button btn-lg"
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>
            <Button
              className="custom-button btn-lg"
              onClick={() => navigate("/")}
            >
              Home
            </Button> */}
            <HomeButtons size={"lg"} />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="custom-container mt-4">
      <Row className="m-4">
        <h2>Admin Dashboard</h2>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={5} sm={"auto"} xs={"auto"}>
          <Card className="custom-card">
            <Card.Title>Welcome, {currentUser?.displayName}!</Card.Title>
            <h6>Choose a platform:</h6>
            <Card.Body>
              <Link to="/admin-dashboard/users">
                <Button variant="primary" size="md" className="m-2">
                  User Management
                </Button>
              </Link>
              <br />
              <Link to="/admin-dashboard/products">
                <Button variant="success" size="md" className="m-2">
                  Product Management
                </Button>
              </Link>
              <br />
              <Link to="/admin-dashboard/orders">
                <Button variant="warning" size="md" className="m-2">
                  Order Management
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <HomeButtons size={"md"} />
      {/* <Row className="mt-4">
        <Col>
          <Button
            className="custom-button"
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
          <Button
            className="custom-button"
            variant="primary"
            size="md"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
        </Col>
      </Row> */}
    </Container>
  );
};

export default AdminDashboard;
