import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useOrderManagementContext } from "../contexts/OrderManagementContext";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/utility/Loader";
import logo from "../assets/logo_small.png";
import HomeButtons from "../components/utility/HomeButtons";
import OrderDetailsCard from "../components/order/OrderDetailsCard";

const OrderSummaryPage = () => {
  const { orderId } = useParams();
  const { currentUser, userLoading } = useAuthContext();
  const { getOrder } = useOrderManagementContext();
  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setOrderLoading(true);

      // Fetch the order
      getOrder(orderId)
        .then((fetchedOrder) => {
          // console.log(fetchedOrder)
          setOrder(fetchedOrder);
        })
        .catch((error) => {
          console.log("Error fetching order: ", error);
          setOrder(null);
        });
    };

    fetchOrder();
    setOrderLoading(false);
  }, [orderId, getOrder]);

  if (orderLoading || userLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <h5>Please log in to start shopping</h5>
            <Button
              variant="success"
              size="lg"
              className="custom-button mt-3"
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

  if (!order) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <h5>Failed to load your order's summary</h5>
            <h6>You may view the order's details in My Orders page</h6>
            <Button className="custom-button" onClick={() => navigate("/")}>
              Home
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="custom-container">
      {currentUser.uid !== order.customer.userId ? (
        <>
          <Row className="mt-4">
            <Col>
              <h5>You do not have permission to view this order</h5>
              <Button className="custom-button" onClick={() => navigate("/")}>
                Home
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="hide-on-print">
            <h1 className="text-center mt-4">
              📷 Thank You for Your Purchase! 📸
            </h1>
            <p>
              Your order has been successfully placed. Below is a summary of
              your purchase.
            </p>
          </Row>

          <Row className="justify-content-center">
            <Image
              src={logo}
              alt="Logo image"
              style={{ maxWidth: "150px", height: "auto" }}
            />
          </Row>

          <OrderDetailsCard order={order} />

          <Row className="mt-4 hide-on-print">
            <Col>
              <Button
                variant="success"
                className="m-2"
                onClick={() => navigate("/")}
              >
                Home
              </Button>{" "}
              <Button
                variant="primary"
                className="m-2"
                onClick={() => navigate("/categories")}
              >
                Continue Shopping
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default OrderSummaryPage;
