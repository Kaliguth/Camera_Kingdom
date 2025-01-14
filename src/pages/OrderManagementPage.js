import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useOrderManagementContext } from "../contexts/OrderManagementContext";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Loader from "../components/utility/Loader";
import Error404 from "../assets/Error404.png";
import HomeButtons from "../components/utility/HomeButtons";

// Order management page in admin dashboard
const OrderManagementPage = () => {
  const { currentUser, userData } = useAuthContext();
  const { ordersLoading } = useOrderManagementContext();
  const navigate = useNavigate();

  if (ordersLoading) {
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
            <HomeButtons size={"lg"} />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="custom-container mt-4">
      <Row className="m-4 hide-on-print">
        <h2>Order Management</h2>
      </Row>

      <Row className="justify-content-center hide-on-print">
        <Col md={6} lg={5} sm={"auto"} xs={"auto"}>
          <Card className="order-container">
            <Card.Title>What would you like to do?</Card.Title>
            <Card.Body>
              <Link to="/admin-dashboard/orders/view">
                <Button variant="primary" size="md" className="m-2">
                  View/Edit Orders
                </Button>
              </Link>
              <br />
              <Link to="/admin-dashboard/orders/confirm">
                <Button variant="success" size="md" className="m-2">
                  Confirm Orders
                </Button>
              </Link>
              <br />
              <Link to="/admin-dashboard/orders/refund">
                <Button variant="warning" size="md" className="m-2">
                  Refund Orders
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Outlet />
      <Link to={"/admin-dashboard"} className="hide-on-print">
        <Button className="custom-button mt-4" variant="warning" size={"md"}>
          Back to Admin Dashboard
        </Button>
      </Link>
      <HomeButtons size={"md"} />
    </Container>
  );
};

export default OrderManagementPage;
