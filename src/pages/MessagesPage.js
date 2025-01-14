import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useMessagesManagementContext } from "../contexts/MessagesManagementContext";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Card,
  Badge,
} from "react-bootstrap";
import Loader from "../components/utility/Loader";
import Error404 from "../assets/Error404.png";
import HomeButtons from "../components/utility/HomeButtons";

// Messages page in admin dashboard
const MessagesPage = () => {
  const { currentUser, userData } = useAuthContext();
  const { messagesLoading, unreadMessages } = useMessagesManagementContext();
  const navigate = useNavigate();

  if (messagesLoading) {
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
      <Row className="m-4">
        <h2>Messages</h2>
      </Row>

      <Row className="justify-content-center">
        <Col md={6} lg={5} sm={"auto"} xs={"auto"}>
          <Card className="order-container">
            <Card.Title>What would you like to do?</Card.Title>
            <Card.Body>
              <Link to="/admin-dashboard/messages/unread">
                <Button variant="primary" size="md" className="m-2">
                  Unread Messages
                  {unreadMessages !== 0 && (
                    <Badge bg="danger" className="ms-2">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
              <br />
              <Link to="/admin-dashboard/messages/viewed">
                <Button variant="success" size="md" className="m-2">
                  Viewed Messages
                </Button>
              </Link>
              <br />
              <Link to="/admin-dashboard/messages/answered">
                <Button variant="warning" size="md" className="m-2">
                  Answered Messages
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Outlet />
      <Link to={"/admin-dashboard"}>
        <Button className="custom-button mt-4" variant="warning" size={"md"}>
          Back to Admin Dashboard
        </Button>
      </Link>
      <HomeButtons size={"md"} />
    </Container>
  );
};

export default MessagesPage;
