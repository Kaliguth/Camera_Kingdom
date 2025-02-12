import React, { useEffect, useState } from "react";
import { useOrderManagementContext } from "../contexts/OrderManagementContext";
import { useValidationContext } from "../contexts/ValidationContext";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/utility/Loader";
import EditOrderAlert from "../components/alerts/EditOrderAlert";
import OrderProductCard from "../components/order/OrderProductCard";

// Order edit page to edit an order in admin dashboard
const OrderEditPage = () => {
  const { orderId } = useParams();
  const { getOrder, updateOrderDetails } = useOrderManagementContext();
  const { formatPrice } = useValidationContext();
  const [order, setOrder] = useState(null);
  const [tempOrderNumber, setTempOrderNumber] = useState(0); // Temporary order number to reflect which order is editted

  // Error texts
  const [orderNumberError, setOrderNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [streetError, setStreetError] = useState("");
  const [houseError, setHouseError] = useState("");
  const [cityError, setCityError] = useState("");

  // Method to reset the errors
  // Used every time save changes is clicked
  const resetErrors = () => {
    setOrderNumberError("");
    setEmailError("");
    setNameError("");
    setPhoneError("");
    setStreetError("");
    setHouseError("");
    setCityError("");
  };

  // Method to set the needed error text
  const updateErrorMessage = (error) => {
    const errorMessage = error.message.toLowerCase();
    let scrollPosition;

    if (errorMessage.includes("order number")) {
      setOrderNumberError(error.message);
      scrollPosition = 520;
    } else if (errorMessage.includes("email")) {
      setEmailError(error.message);
      scrollPosition = 560;
    } else if (errorMessage.includes("full name")) {
      setNameError(error.message);
      scrollPosition = 600;
    } else if (errorMessage.includes("phone number")) {
      setPhoneError(error.message);
      scrollPosition = 620;
    } else if (errorMessage.includes("street")) {
      setStreetError(error.message);
      scrollPosition = 780;
    } else if (errorMessage.includes("house")) {
      setHouseError(error.message);
      scrollPosition = 800;
    } else if (errorMessage.includes("city")) {
      setCityError(error.message);
      scrollPosition = 1160;
    } else {
      toast.error(error.message);
    }

    // Scroll to error position after a short delay
    if (scrollPosition !== undefined) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      }, 200);
    }
  };

  // useEffect to fetch the order to edit by id in params
  useEffect(() => {
    const fetchOrder = async () => {
      // Fetch the order
      const fetchedOrder = await getOrder(orderId);
      setOrder(fetchedOrder);
      setTempOrderNumber(fetchedOrder.orderNumber);
    };

    fetchOrder();
  }, [orderId, getOrder]);

  // Property change handles
  const handleStatusAndNumberChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleEmailChange = (e) => {
    setOrder({
      ...order,
      customer: { ...order.customer, email: e.target.value },
    });
  };

  const handleFullNameChange = (e) => {
    setOrder({
      ...order,
      customer: { ...order.customer, fullName: e.target.value },
    });
  };

  const handlePhoneNumberChange = (e) => {
    setOrder({
      ...order,
      customer: { ...order.customer, phoneNumber: e.target.value },
    });
  };

  const handleStreetChange = (e) => {
    setOrder({
      ...order,
      shipping: { ...order.shipping, streetName: e.target.value },
    });
  };

  const handleHouseNumberChange = (e) => {
    setOrder({
      ...order,
      shipping: { ...order.shipping, houseNumber: e.target.value },
    });
  };

  const handleCityChange = (e) => {
    setOrder({
      ...order,
      shipping: { ...order.shipping, city: e.target.value },
    });
  };

  const handleDeliveryInfoChange = (e) => {
    setOrder({
      ...order,
      shipping: { ...order.shipping, deliveryInfo: e.target.value },
    });
  };

  // Form submit handle (updating the order)
  const handleSaveChanges = (e) => {
    e.preventDefault();
    resetErrors();

    // Capitalizing name, street and city
    const capitalizedName =
      order.customer.fullName.charAt(0).toUpperCase() +
      order.customer.fullName.slice(1);
    const capitalizedStreet =
      order.shipping.streetName.charAt(0).toUpperCase() +
      order.shipping.streetName.slice(1);
    const capitalizedCity =
      order.shipping.city.charAt(0).toUpperCase() +
      order.shipping.city.slice(1);

    // Converting order number to a number
    const convertedOrderNumber = Number(order.orderNumber);

    // Temporary updated order object
    const updatedOrder = {
      ...order,
      status: order.status,
      orderNumber: convertedOrderNumber,
      customer: {
        ...order.customer,
        email: order.customer.email,
        fullName: capitalizedName,
        phoneNumber: order.customer.phoneNumber,
      },
      shipping: {
        ...order.shipping,
        streetName: capitalizedStreet,
        houseNumber: order.shipping.houseNumber,
        city: capitalizedCity,
      },
    };

    EditOrderAlert(tempOrderNumber)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return updateOrderDetails(updatedOrder);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success(
          `Changes to order number ${tempOrderNumber} saved successfully`
        );

        // Update the order state only after update is complete
        setOrder(updatedOrder);

        // Scroll to top after a short delay
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Order edit canceled by the user");
        } else {
          updateErrorMessage(error);
        }
      });
  };

  if (!order) {
    return <Loader />;
  }

  return (
    <Container className="custom-container">
      <hr className="thick-hr m-5" />

      <Card className="custom-card">
        <Card.Header>
          <h3>
            <u>Editing Order Number {tempOrderNumber}</u>
          </h3>
        </Card.Header>

        <Card.Body>
          <Link to={`/admin-dashboard/orders/view/${order.id}`}>
            <Button className="mt-1 mb-3" variant="primary" size="md">
              Review Order's Details
            </Button>
          </Link>

          <Form onSubmit={handleSaveChanges}>
            <Form.Label>
              <b>
                <u>Order Details</u>
              </b>
            </Form.Label>

            <Row className="justify-content-center mt-2 mb-3">
              <Form.Label>
                Order ID: <b>{order.id}</b>
              </Form.Label>

              <Form.Label>
                Date Placed: <b>{order.purchase.date}</b>
              </Form.Label>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>Order Status:</Form.Label>
                  <Form.Select
                    className="form-controls text-center"
                    name="status"
                    value={order.status}
                    onChange={handleStatusAndNumberChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>Order Number:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    name="orderNumber"
                    type="number"
                    min={0}
                    value={order.orderNumber}
                    onWheel={(e) => e.target.blur()} // Disable value change by mousewheel
                    onChange={handleStatusAndNumberChange}
                    isInvalid={!!orderNumberError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{orderNumberError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <hr className="thick-hr" />
            <Form.Label>
              <b>
                <u>Customer Details</u>
              </b>
            </Form.Label>
            <Row className="justify-content-center mt-2 mb-3">
              <Form.Label>
                User ID: <b>{order.customer.userId}</b>
              </Form.Label>

              <Form.Label>
                User Display Name: <b>{order.customer.displayName}</b>
              </Form.Label>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col lg={5} md={6} sm={7} xs={10}>
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="email"
                    value={order.customer.email}
                    onChange={handleEmailChange}
                    isInvalid={!!emailError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{emailError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>Full Name:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="text"
                    value={order.customer.fullName}
                    onChange={handleFullNameChange}
                    isInvalid={!!nameError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{nameError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="number"
                    min={0}
                    value={order.customer.phoneNumber}
                    onWheel={(e) => e.target.blur()} // Disable value change by mousewheel
                    onChange={handlePhoneNumberChange}
                    isInvalid={!!phoneError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{phoneError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <hr className="thick-hr" />
            <Form.Label>
              <b>
                <u>Shipping Details</u>
              </b>
            </Form.Label>

            <Row className="justify-content-center mt-2 mb-3">
              <Form.Label>
                Delivery Option: <b>{order.shipping.deliveryOption}</b>
              </Form.Label>
            </Row>

            <Row className="justify-content-center mt-2 mb-4">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>Street Name:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="text"
                    value={order.shipping.streetName}
                    onChange={handleStreetChange}
                    isInvalid={!!streetError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{streetError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>House Number:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="text"
                    value={order.shipping.houseNumber}
                    onChange={handleHouseNumberChange}
                    isInvalid={!!houseError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{houseError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>City:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="text"
                    value={order.shipping.city}
                    onChange={handleCityChange}
                    isInvalid={!!cityError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{cityError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col lg={10} md={10} sm={10} xs={10}>
                <Form.Group>
                  <Form.Label>Additional Delivery Information:</Form.Label>
                  <Form.Control
                    className="form-controls"
                    as="textarea"
                    rows={3}
                    name="deliveryInfo"
                    value={order.shipping.deliveryInfo}
                    onChange={handleDeliveryInfoChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="thick-hr" />
            <Form.Label>
              <b>
                <u>Purchase Details</u>
              </b>
            </Form.Label>
            <Row className="justify-content-center mt-2 mb-4">
              <Form.Label>
                Number of Products: <b>{order.purchase.products.length}</b>
              </Form.Label>
              <Card className="order-container w-75 mt-2 mb-4">
                {order.purchase.products.map((product) => (
                  <Container key={product.id}>
                    <OrderProductCard product={product} />
                  </Container>
                ))}
              </Card>
            </Row>

            <hr className="thick-hr" />
            <Form.Label>
              <b>
                <u>Payment Details</u>
              </b>
            </Form.Label>
            <Row className="justify-content-center mt-2 mb-3">
              <Form.Label>
                Products Price:{" "}
                <b>{formatPrice(order.purchase.productsPrice)}</b>
              </Form.Label>

              <Form.Label>
                Shipping Price:{" "}
                <b>{formatPrice(order.purchase.shippingPrice)}</b>
              </Form.Label>

              <Form.Label>
                Total Price After Shipping:{" "}
                <b>{formatPrice(order.purchase.totalPrice)}</b>
              </Form.Label>

              {order.purchase.coupon && (
                <>
                  <Form.Label>
                    Coupon: <b>{order.purchase.coupon}</b>
                  </Form.Label>

                  <Form.Label>
                    Discount: <b>{order.purchase.discount}</b>
                  </Form.Label>

                  <Form.Label>
                    Total Price After Discount:{" "}
                    <b>{formatPrice(order.purchase.discountedPrice)}</b>
                  </Form.Label>
                </>
              )}

              <Form.Label>
                Number of Payments: <b>{order.payment.numberOfPayments}</b>
              </Form.Label>
            </Row>

            <hr className="thick-hr mb-4" />
            <Button variant="primary" size="lg" type="submit">
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Link to="/admin-dashboard/orders/view">
        <Button variant="warning" size="md" className="mt-4">
          Close
        </Button>
      </Link>
    </Container>
  );
};

export default OrderEditPage;
