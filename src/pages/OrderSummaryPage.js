import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useValidationContext } from "../contexts/ValidationContext";
import { ordersRef } from "../firebase/firestore";
import Loader from "../components/utility/Loader";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo_small.png";
import OrderProductCard from "../components/order/OrderProductCard";
import HomeButtons from "../components/utility/HomeButtons";

const OrderSummaryPage = () => {
  const { orderId } = useParams();
  const { currentUser, userLoading } = useAuthContext();
  const { formatPrice } = useValidationContext();
  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setOrderLoading(true);
      try {
        const orderDocRef = doc(ordersRef, orderId);
        const orderDoc = await getDoc(orderDocRef);

        if (orderDoc.exists()) {
          setOrder(orderDoc.data());
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
      setOrderLoading(false);
    };

    fetchOrder();
  }, [orderId]);

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
      {/* <Row className="m-4">
        <h2>Order Summary</h2>
      </Row> */}
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

          <Row className="mb-4">
            <h3 className="mb-2">
              <u>Order Details</u>
            </h3>
            <h5>
              <b>Order Number: {order.orderNumber}</b>
            </h5>
            <p>
              <b>Order Date:</b> {order.purchase.date}
            </p>
          </Row>

          <Row className="justify-content-center mb-3">
            <Card className="order-container w-75 mb-4">
              <Card.Header className="mb-3">
                <h5 className="m-3">Products</h5>
              </Card.Header>
              {/* <Row>
                <Col xs={4} md={5}>
                  <small className="text-muted">Product</small>
                </Col>
                <Col xs={3} md={2}>
                  <small className="text-muted">Quantity</small>
                </Col>
                <Col xs={2} md={2}>
                  <small className="text-muted">Unit Price</small>
                </Col>
                <Col xs={2} md={2}>
                  <small className="text-muted">Total Price</small>
                </Col>
              </Row> */}
              {order.purchase.products.map((product) => (
                <OrderProductCard key={product.id} product={product} />
              ))}
            </Card>
          </Row>

          <Row className="row-print-flex justify-content-center mb-3">
            <Col md={3} className="col-print-flex mb-3">
              <h4>
                <u>Contact Information</u>
              </h4>
              <h6>
                <b>Name:</b> {order.customer.fullName}
              </h6>
              <h6>
                <b>Phone Number:</b> {order.customer.phoneNumber}
              </h6>
              <h6>
                <b>Email:</b> {order.customer.email}
              </h6>
            </Col>

            <Col md={3} className="col-print-flex mb-3">
              <h4>
                <u>Shipping Information</u>
              </h4>
              <h6>
                <b>Address:</b> {order.shipping.streetName}{" "}
                {order.shipping.houseNumber}
              </h6>
              <h6>
                <b>City:</b> {order.shipping.city}
              </h6>
              <h6>
                <b>Delivery Option:</b> {order.shipping.deliveryOption}
              </h6>
              {order.shipping.deliveryInfo.trim() !== "" && (
                <h6>
                  <b>Additional Delivery Information:</b>{" "}
                  {order.shipping.deliveryInfo}
                </h6>
              )}
            </Col>

            <Col md={3} className="col-print-flex mb-3">
              <h4>
                <u>Payment Summary</u>
              </h4>
              <h6>
                <b>Subtotal:</b> {formatPrice(order.purchase.productsPrice)}
              </h6>
              <h6>
                <b>Shipping:</b> {formatPrice(order.purchase.shippingPrice)}
              </h6>
              {order.purchase.coupon ? (
                <>
                  <h6>
                    <b>Coupon:</b> {order.purchase.coupon}
                  </h6>
                  <h6>
                    <b>Discount:</b> {order.purchase.discount}
                  </h6>
                  <h6>
                    <b>Total:</b> {formatPrice(order.purchase.discountedPrice)}
                  </h6>
                </>
              ) : (
                <h6>
                  <b>Total:</b> ${order.purchase.totalPrice.toFixed(2)}
                </h6>
              )}
            </Col>
          </Row>

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
              </Button>{" "}
              <Button
                variant="secondary"
                className="m-2"
                onClick={() => window.print()}
              >
                Print Invoice
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default OrderSummaryPage;
