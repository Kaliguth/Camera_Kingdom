import React from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { ordersRef } from "../firebase/firestore";
import Loader from "../components/utility/Loader";

const OrderSummaryPage = () => {
  const { ordernumber } = useParams();
  const { currentUser, userLoading } = useAuthContext();
  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setOrderLoading(true);
      try {
        const orderDocRef = doc(ordersRef, ordernumber);
        const orderDoc = await getDoc(orderDocRef);

        if (orderDoc.exists()) {
          setOrder(orderDoc.data());
        }
      } catch (fetchError) {
        console.error("Error fetching order:", fetchError);
      } finally {
        setOrderLoading(false);
      }
    };

    fetchOrder();
  }, [ordernumber]);

  if (orderLoading || userLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <p>Please log in to start shopping</p>
            <Button
              variant="success"
              size="lg"
              className="m-4"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <br />
            <Button className="m-2" onClick={() => navigate(-1)}>
              Go back
            </Button>
            <Button className="m-2" onClick={() => navigate("/")}>
              Home
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="custom-container mt-4 mb-5">
      {/* <Row className="justify-content-center"> */}
      <Row className="m-4">
        <h2>Order Summary</h2>
      </Row>
      {currentUser.uid !== order.customer.userId ? (
        <>
          <h5>You do not have permission to view this order</h5>
          <Button className="m-2" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button className="m-2" onClick={() => navigate("/")}>
            Home
          </Button>
        </>
      ) : (
        <Row className="m-4">
          <Col md={8}>
            <h1 className="text-center mb-4">Thank You for Your Purchase!</h1>
            <p className="text-center text-muted">
              Your order has been successfully placed. Below is a summary of
              your purchase.
            </p>
            <div className="order-summary mt-4">
              <h4>Order Details</h4>
              <p>
                <strong>Order Number:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Order Date:</strong> {order.purchase.date}
              </p>
            </div>
            <div className="order-items mt-4">
              <h4>Items Purchased</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.purchase.products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>${product.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="order-summary mt-4">
              <h4>Summary</h4>
              <p>
                <strong>Subtotal:</strong> ${order.purchase.productsPrice}
              </p>
              <p>
                <strong>Shipping:</strong> ${order.purchase.shippingPrice}
              </p>
              {order.purchase.coupon ? (
                <>
                  <p>
                    <strong>Discount:</strong> ${order.purchase.discount}
                  </p>
                  <p>
                    <strong>Total:</strong> $
                    {order.purchase.discountedPrice.toFixed(2)}
                  </p>
                </>
              ) : (
                <p>
                  <strong>Total:</strong> $
                  {order.purchase.totalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="customer-info mt-4">
              <h4>Customer Information</h4>
              <p>
                <strong>Name:</strong> {order.customer.fullName}
              </p>
              <p>
                <strong>Phone Number:</strong> {order.customer.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {order.customer.email}
              </p>
            </div>
            <div className="shipping-info mt-4">
              <h4>Shipping Information</h4>
              <p>
                <strong>Address:</strong> {order.shipping.streetName}{" "}
                {order.shipping.houseNumber}, {order.shipping.city}
              </p>
              <p>
                <strong>Delivery Option:</strong>{" "}
                {order.shipping.deliveryOption}
              </p>
              <p>
                <strong>Delivery Information:</strong>
                {order.shipping.deliveryInfo}
              </p>
            </div>
            <div className="mt-4 text-center">
              <Button variant="success" onClick={() => navigate("/")}>
                Back to Home
              </Button>{" "}
              <Button variant="primary" onClick={() => navigate("/categories")}>
                Shop More
              </Button>{" "}
              <Button
                variant="outline-secondary"
                onClick={() => window.print()}
              >
                Print Invoice
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrderSummaryPage;
