import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useOrderManagementContext } from "../contexts/OrderManagementContext";
import { useValidationContext } from "../contexts/ValidationContext";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/utility/Loader";
import Error404 from "../assets/Error404.png";
import CancelOrderAlert from "../components/alerts/CancelOrderAlert";
import OrderProductCard from "../components/order/OrderProductCard";
import HomeButtons from "../components/utility/HomeButtons";

// Order page to display all places orders
const OrdersPage = () => {
  const { currentUser, userData } = useAuthContext();
  const { ordersLoading, cancelOrder } = useOrderManagementContext();
  const { formatPrice } = useValidationContext();
  const navigate = useNavigate();

  // Cancel order handle
  const handleCancelOrder = (order) => {
    CancelOrderAlert(order)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return cancelOrder(order.id);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success(
          `Order number ${order.orderNumber} has been successfully canceled`
        );
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Order cancelation canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

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

  return (
    <Container className="custom-container mt-4">
      <h2 className="mb-4">My Orders</h2>

      {userData.orders.length === 0 ? (
        <>
          <p>You haven't completed any orders yet</p>
          <Button
            className="custom-button mt-3"
            variant="success"
            size="lg"
            onClick={() => navigate("/categories")}
          >
            Start shopping
          </Button>
        </>
      ) : (
        <Row className="justify-content-center">
          <p>(You have made {userData.orders.length} orders)</p>
          {userData.orders.map((order) => (
            <Col xs={12} key={order.id} className="mt-4 mb-4">
              <Card className="custom-card">
                <Card.Header className="d-flex justify-content-between">
                  <span>
                    <b>Order #{order.orderNumber}</b>
                  </span>
                  <span
                    style={{
                      color:
                        order.status === "Confirmed" ||
                        order.status === "Shipped" ||
                        order.status === "Completed"
                          ? "green"
                          : order.status === "Pending" ||
                            order.status === "Processing"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {order.status}
                  </span>
                </Card.Header>
                <Card.Body>
                  <p>
                    <b>Order ID:</b> {order.id}
                  </p>
                  <p>
                    <b>Date:</b> {order.purchase.date}
                  </p>
                  <p>
                    <b>Total Price:</b>{" "}
                    {formatPrice(order.purchase.discountedPrice)}
                  </p>
                  <hr />

                  <Row className="justify-content-center">
                    <Card className="order-container w-75 mt-3 mb-1">
                      <Card.Header className="mb-3">
                        <h5 className="m-3">Products</h5>
                      </Card.Header>
                      {order.purchase.products.map((product) => (
                        <OrderProductCard key={product.id} product={product} />
                      ))}
                    </Card>
                  </Row>
                </Card.Body>

                <hr />
                <Row className="bg-light d-flex justify-content-center align-items-center">
                  <Col lg={"auto"}>
                    <Link to={`/orders/${order.id}`}>
                      <Button
                        className="custom-button mt-2"
                        variant="primary"
                        size="sm"
                      >
                        View Order Details
                      </Button>
                    </Link>

                    {order.status === "Pending" && (
                      <Button
                        className="custom-button mt-2"
                        variant="warning"
                        size="sm"
                        onClick={() => handleCancelOrder(order)}
                      >
                        Cancel Order
                      </Button>
                    )}

                    {order.status === "Completed" && (
                      <Link to={`/contact-us/${order.id}`}>
                        <Button
                          className="custom-button mt-2"
                          variant="warning"
                          size="sm"
                        >
                          Request Refund
                        </Button>
                      </Link>
                    )}

                    <Link to={`/contact-us/${order.id}`}>
                      <Button
                        className="custom-button mt-2"
                        variant="danger"
                        size="sm"
                      >
                        Contact Us
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <HomeButtons size={"md"} />
    </Container>
  );
};

export default OrdersPage;
