import React, { useEffect, useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import { useOrderManagementContext } from "../contexts/OrderManagementContext";
import { useValidationContext } from "../contexts/ValidationContext";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/utility/Loader";
import noImage from "../assets/no-image.png";
import EditProductAlert from "../components/alerts/EditProductAlert";
import OrderProductCard from "../components/order/OrderProductCard";

const OrderEditPage = () => {
  const { orderId } = useParams();
  const { getOrder } = useOrderManagementContext();
  const { formatPrice } = useValidationContext();
  const [order, setOrder] = useState(null);
  const [tempOrderNumber, setTempOrderNumber] = useState(0);

  // Error texts
  const [brandError, setBrandError] = useState("");
  const [modelError, setModelError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descError, setDescError] = useState("");
  const [imagesError, setImagesError] = useState("");
  const [overviewError, setOverviewError] = useState("");
  const [specNameError, setSpecNameError] = useState("");
  const [specDetailError, setSpecDetailError] = useState("");

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
    setBrandError("");
    setModelError("");
    setTypeError("");
    setPriceError("");
    setDescError("");
    setImagesError("");
    setOverviewError("");
    setSpecNameError("");
    setSpecDetailError("");

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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

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

  // Form submit handle (updating the product)
  const handleSaveChanges = (e) => {
    e.preventDefault();
    resetErrors();

    // // Filtering images from empty inputs
    // const filteredImages = product.images.filter(
    //   (image) => image.trim() !== ""
    // );
    // // Capitalizing brand, model and type
    // const capitalizedBrand =
    //   product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
    // const capitalizedModel =
    //   product.model.charAt(0).toUpperCase() + product.model.slice(1);
    // const capitalizedType =
    //   product.type.charAt(0).toUpperCase() + product.type.slice(1);

    // // Converting price to a number
    // const convertedPrice = Number(product.price);

    // // Temporary updated product object
    // const updatedProduct = {
    //   ...product,
    //   images: filteredImages,
    //   brand: capitalizedBrand,
    //   model: capitalizedModel,
    //   type: capitalizedType,
    //   price: convertedPrice,
    // };

    // EditProductAlert(product.model)
    //   .then((isConfirmed) => {
    //     if (isConfirmed) {
    //       return updateProductProperties(updatedProduct);
    //     } else {
    //       throw new Error("canceled");
    //     }
    //   })
    //   .then(() => {
    //     toast.success(`Changes to ${product.model} saved successfully`);

    //     // Update the product state only after update is complete
    //     setProduct(updatedProduct);
    //     // Scroll to top after a short delay
    //     setTimeout(() => {
    //       window.scrollTo(0, 0);
    //     }, 100);
    //   })
    //   .catch((error) => {
    //     if (error.message === "canceled") {
    //       console.log("Product edit canceled by the user");
    //     } else {
    //       updateErrorMessage(error);
    //     }
    //   });
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
                  />
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
                  />
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
                  />
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
                  />
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
                  />
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
                  />
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
                  />
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
                    {/* <Button
                      variant="danger"
                      size="sm"
                      // onClick={() => handleRemoveProduct(product.id)}
                    >
                      Remove {product.model}
                    </Button> */}
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
