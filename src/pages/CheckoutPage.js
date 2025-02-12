import React, { useState } from "react";
import Loader from "../components/utility/Loader";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useAuthContext } from "../contexts/AuthContext";
import { useCartContext } from "../contexts/CartContext";
import { usePurchaseContext } from "../contexts/PurchaseContext";
import { useValidationContext } from "../contexts/ValidationContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CartProductCard from "../components/cart/CartProductCard";
import HomeButtons from "../components/utility/HomeButtons";

// Checkout page
const CheckoutPage = () => {
  const { currentUser, userLoading } = useAuthContext();
  const { cart, cartLoading } = useCartContext();
  const {
    shippingPrice,
    orderPayment,
    orderTotalPrice,
    discountedPrice,
    completeOrder,
  } = usePurchaseContext();
  const { formatPrice, getCoupon } = useValidationContext();
  // Payment details
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [numberOfPayments, setNumberOfPayments] = useState("1");
  // Shipment details
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [streetName, setStreetName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("None");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  // Details confirmation
  const [confirm, setConfirm] = useState(false);
  // useNavigate
  const navigate = useNavigate();

  // Error texts
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [streetError, setStreetError] = useState("");
  const [houseError, setHouseError] = useState("");
  const [cityError, setCityError] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const [cardholderError, setCardholderError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [expirationError, setExpirationError] = useState("");
  const [cvcError, setCvcError] = useState("");
  const [couponError, setCouponError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Method to reset the errors
  // Used every time a complete order is clicked
  const resetErrors = () => {
    setNameError("");
    setPhoneError("");
    setEmailError("");
    setStreetError("");
    setHouseError("");
    setCityError("");
    setDeliveryError("");
    setCardholderError("");
    setCardNumberError("");
    setExpirationError("");
    setCvcError("");
    setCouponError("");
    setConfirmError("");
  };

  // Method to set the needed error text
  const updateErrorMessage = (error) => {
    const errorMessage = error.message.toLowerCase();
    let scrollPosition;

    if (errorMessage.includes("your name")) {
      setNameError(error.message);
      scrollPosition = 560;
    } else if (errorMessage.includes("phone")) {
      setPhoneError(error.message);
      scrollPosition = 580;
    } else if (errorMessage.includes("email")) {
      setEmailError(error.message);
      scrollPosition = 600;
    } else if (errorMessage.includes("street")) {
      setStreetError(error.message);
      scrollPosition = 560;
    } else if (errorMessage.includes("house")) {
      setHouseError(error.message);
      scrollPosition = 580;
    } else if (errorMessage.includes("city")) {
      setCityError(error.message);
      scrollPosition = 600;
    } else if (errorMessage.includes("delivery")) {
      setDeliveryError(error.message);
      scrollPosition = 620;
    } else if (errorMessage.includes("cardholder")) {
      setCardholderError(error.message);
      scrollPosition = 1900;
    } else if (errorMessage.includes("card number")) {
      setCardNumberError(error.message);
      scrollPosition = 1900;
    } else if (errorMessage.includes("expiration")) {
      setExpirationError(error.message);
      scrollPosition = 1900;
    } else if (errorMessage.includes("cvc")) {
      setCvcError(error.message);
      scrollPosition = 1900;
    } else if (errorMessage.includes("coupon")) {
      setCouponError(error.message);
      scrollPosition = 1900;
    } else if (errorMessage.includes("confirm")) {
      setConfirmError(error.message);
      scrollPosition = 2500;
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

  // Const for total price with shipping
  const totalPricePlusShipping =
    orderTotalPrice() + shippingPrice(deliveryOption);

  const handleContinueShopping = () => {
    navigate("/categories");
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    resetErrors();

    getCoupon(couponCode)
      .then((coupon) => {
        if (coupon === null || coupon === undefined) {
          setCouponError("Invalid coupon code");
        } else {
          setCoupon(coupon);
          toast.success("Coupon applied!");
        }
      })
      .catch((error) => {
        updateErrorMessage(error);
      });
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    resetErrors();

    const orderDetails = {
      shipping: {
        fullName,
        phoneNumber,
        email,
        streetName,
        houseNumber,
        city,
        deliveryOption,
        deliveryInfo,
      },
      payment: {
        cardHolderName,
        cardNumber,
        expirationDate,
        cvc,
        numberOfPayments,
        coupon,
      },
    };

    completeOrder(orderDetails, confirm)
      .then((orderId) => {
        toast.success("Order completed successfully!");
        navigate(`/order-summary/${orderId}`);
      })
      .catch((error) => {
        updateErrorMessage(error);
      });
  };

  if (userLoading || cartLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <h5>Please log in to complete an order</h5>
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

  return (
    <Container className="custom-container mt-4 mb-5">
      <Row className="m-4">
        <h2>Checkout</h2>
      </Row>
      {cart.length === 0 ? (
        <>
          <h5>You have not added any products to purchase!</h5>
          <Button
            variant="success"
            size="lg"
            className="custom-button mt-3"
            onClick={() => navigate("/categories")}
          >
            Start shopping
          </Button>
          <HomeButtons size={"md"} />
        </>
      ) : (
        <>
          <Row>
            <Col>
              <Card className="order-container">
                <Card.Header className="mb-3">
                  <h5 className="m-3">Order items</h5>
                </Card.Header>
                <>
                  {cart.map((product) => (
                    <CartProductCard key={product.id} product={product} />
                  ))}
                </>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5 d-flex justify-content-center">
            <Col md={8}>
              <Card className="order-container">
                <Card.Header>
                  <h5 className="m-3">Shipping details</h5>
                  <p>Please fill in the shipping information</p>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <p>
                          <b>Contact Information:</b>
                        </p>
                        <Form.Group
                          className="mb-3 text-start custom-form-group"
                          controlId="formBasicName"
                        >
                          <Form.Label>Full name:</Form.Label>
                          <Form.Control
                            className="form-controls"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            isInvalid={!!nameError}
                          />
                          <Form.Control.Feedback type="invalid">
                            <b>{nameError}</b>
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3 text-start custom-form-group"
                          controlId="formBasicPhone"
                        >
                          <Form.Label>Phone number:</Form.Label>
                          <Form.Control
                            className="form-controls"
                            type="text"
                            maxLength={10}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            isInvalid={!!phoneError}
                          />
                          <Form.Control.Feedback type="invalid">
                            <b>{phoneError}</b>
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3 text-start custom-form-group"
                          controlId="formBasicEmail"
                        >
                          <Form.Label>Email address:</Form.Label>
                          <Form.Control
                            className="form-controls"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!!emailError}
                          />
                          <Form.Control.Feedback type="invalid">
                            <b>{emailError}</b>
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <p>
                          <b>Address Information:</b>
                        </p>
                        <Form.Group
                          className="mb-3 text-start custom-form-group"
                          controlId="formStreet"
                        >
                          <Form.Label>Street name:</Form.Label>
                          <Form.Control
                            className="form-controls"
                            type="text"
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                            isInvalid={!!streetError}
                          />
                          <Form.Control.Feedback type="invalid">
                            <b>{streetError}</b>
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3 text-start custom-form-group"
                          controlId="formHouse"
                        >
                          <Form.Label>House number:</Form.Label>
                          <Form.Control
                            className="form-controls"
                            type="text"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            isInvalid={!!houseError}
                          />
                          <Form.Control.Feedback type="invalid">
                            <b>{houseError}</b>
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3 text-start custom-form-group"
                          controlId="formCity"
                        >
                          <Form.Label>City:</Form.Label>
                          <Form.Control
                            className="form-controls"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            isInvalid={!!cityError}
                          />
                          <Form.Control.Feedback type="invalid">
                            <b>{cityError}</b>
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Delivery Method Combo Box */}
                    <Form.Group
                      className="mb-3 text-start custom-form-group"
                      controlId="deliveryMethod"
                    >
                      <Form.Label>Delivery option:</Form.Label>
                      <Form.Select
                        className="form-controls"
                        value={deliveryOption}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        isInvalid={!!deliveryError}
                      >
                        <option value="None">
                          Please choose a delivery option
                        </option>
                        <option value="Standard">
                          Standard delivery (7-14 business days) - ₪ 0
                        </option>
                        <option value="Express">
                          Express delivery (3-5 business days - Free for orders
                          over ₪ 500)
                          {orderTotalPrice() > 500 ? " - ₪ 0" : " - ₪ 60"}
                        </option>
                        {/* <option value="pickup">Pickup from Store</option> */}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <b>{deliveryError}</b>
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mt-4" controlId="formBasicMessage">
                      <Form.Label>Additional delivery information:</Form.Label>
                      <Form.Control
                        className="form-controls"
                        as="textarea"
                        rows={3}
                        value={deliveryInfo}
                        onChange={(e) => setDeliveryInfo(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
              {/* </Container> */}
            </Col>
          </Row>

          <Row className="mt-5">
            <Col md={8} className="mb-5">
              <Card className="order-container">
                <Card.Header>
                  <h5 className="m-3">Payment details</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group
                      className="mb-3 text-start custom-form-group"
                      controlId="formCardName"
                    >
                      <Form.Label>Cardholder name:</Form.Label>
                      <Form.Control
                        className="form-controls"
                        type="text"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        isInvalid={!!cardholderError}
                        // placeholder="Enter cardholder's name"
                      />
                      <Form.Control.Feedback type="invalid">
                        <b>{cardholderError}</b>
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      className="mb-3 text-start custom-form-group"
                      controlId="formCardNumber"
                    >
                      <Form.Label>Card number:</Form.Label>
                      <Form.Control
                        className="form-controls"
                        type="text"
                        pattern="[0-9]*"
                        maxLength={19}
                        value={cardNumber}
                        placeholder="1234 5678 9012 3456"
                        onChange={(e) => {
                          // Add spaces after every 4 characters
                          if (e.target.value.length > 4) {
                            e.target.value = e.target.value.replace(
                              /(\d{4})(?=\d)/g,
                              "$1 "
                            );
                          }

                          // Set the modified value
                          setCardNumber(e.target.value);
                        }}
                        isInvalid={!!cardNumberError}
                      />
                      <Form.Control.Feedback type="invalid">
                        <b>{cardNumberError}</b>
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3 text-start custom-form-group"
                          controlId="formExpirationDate"
                        >
                          <Form.Label>Expiration date:</Form.Label>
                          <Form.Control
                            className="form-controls"
                            type="text"
                            pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                            maxLength={5}
                            value={expirationDate}
                            placeholder="MM/YY"
                            onChange={(e) => {
                              let value = e.target.value;

                              // Add slash automatically after two digits
                              if (value.length === 2 && !value.includes("/")) {
                                value += `/`;
                              }

                              // Set the modified value
                              setExpirationDate(value);
                            }}
                            isInvalid={!!expirationError}
                          />
                          <Form.Control.Feedback type="invalid">
                            <b>{expirationError}</b>
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3 text-start custom-form-group"
                          controlId="formCVC"
                        >
                          <Form.Label>CVC:</Form.Label>
                          <Form.Control
                            className="form-controls"
                            type="text"
                            maxLength={3}
                            value={cvc}
                            placeholder="3-digit security number"
                            // onInput={(e) => {
                            //   // Do not allow non-numeric characters
                            //   const value = e.target.value.replace(/\D/g, "");

                            //   // Set the modified value
                            //   e.target.value = value;
                            //   setCvc(e.target.value);
                            // }}
                            onChange={(e) => setCvc(e.target.value)}
                            isInvalid={!!cvcError}
                          />
                          <Form.Control.Feedback type="invalid">
                            <b>{cvcError}</b>
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* Payment Option Combo Box */}
                    <Form.Group
                      className="text-start"
                      controlId="paymentOption"
                    >
                      <Form.Label>Number of payments:</Form.Label>
                      <Form.Select
                        className="form-controls"
                        value={numberOfPayments}
                        onChange={(e) => setNumberOfPayments(e.target.value)}
                      >
                        <option value="1">
                          1 Payment (1 × {formatPrice(totalPricePlusShipping)})
                        </option>
                        <option value="2">
                          2 Payments (2 ×{" "}
                          {formatPrice(orderPayment(totalPricePlusShipping, 2))}
                          )
                        </option>
                        <option value="3">
                          3 Payments (3 ×{" "}
                          {formatPrice(orderPayment(totalPricePlusShipping, 3))}
                          )
                        </option>
                        <option value="4">
                          4 Payments (4 ×{" "}
                          {formatPrice(orderPayment(totalPricePlusShipping, 4))}
                          )
                        </option>
                        <option value="5">
                          5 Payments (5 ×{" "}
                          {formatPrice(orderPayment(totalPricePlusShipping, 5))}
                          )
                        </option>
                        <option value="6">
                          6 Payments (6 ×{" "}
                          {formatPrice(orderPayment(totalPricePlusShipping, 6))}
                          )
                        </option>
                        <option value="7">
                          7 Payments (7 ×{" "}
                          {formatPrice(orderPayment(totalPricePlusShipping, 7))}
                          )
                        </option>
                        <option value="8">
                          8 Payments (8 ×{" "}
                          {formatPrice(orderPayment(totalPricePlusShipping, 8))}
                          )
                        </option>
                        <option value="9">
                          9 Payments (9 ×{" "}
                          {formatPrice(orderPayment(totalPricePlusShipping, 9))}
                          )
                        </option>
                        <option value="10">
                          10 Payments (10 ×{" "}
                          {formatPrice(
                            orderPayment(totalPricePlusShipping, 10)
                          )}
                          )
                        </option>
                        <option value="11">
                          11 Payments (11 ×{" "}
                          {formatPrice(
                            orderPayment(totalPricePlusShipping, 11)
                          )}
                          )
                        </option>
                        <option value="12">
                          12 Payments (12 ×{" "}
                          {formatPrice(
                            orderPayment(totalPricePlusShipping, 12)
                          )}
                          )
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="order-container">
                <Card.Header>
                  <h5 className="m-3">Order summary</h5>
                </Card.Header>
                <Card.Body className="text-start">
                  {/* <h6>Total products: {cart.length}</h6> */}
                  {cart.map((product) => (
                    <Row key={product.id} className="mb-2">
                      <Col>
                        <p>
                          <b>
                            {product.brand} {product.model}
                          </b>{" "}
                          × {product.quantity}
                        </p>
                      </Col>
                      <Col className="text-end">
                        {formatPrice(product.price * product.quantity)}
                      </Col>
                    </Row>
                  ))}

                  <hr />
                  <Row className="mt-3">
                    <Col>
                      <h6>Shipping:</h6>
                      <h6>Total price:</h6>
                      {coupon && (
                        <>
                          <h6>Discount:</h6>
                          <h6>Final price:</h6>
                        </>
                      )}
                    </Col>
                    <Col md={7} className="text-end">
                      <h6>
                        <b>₪{shippingPrice(deliveryOption)}</b>
                      </h6>
                      <h6>
                        {formatPrice(
                          orderPayment(totalPricePlusShipping, numberOfPayments)
                        )}{" "}
                        × {numberOfPayments} ={" "}
                        <b>{formatPrice(totalPricePlusShipping)}</b>
                      </h6>
                      {coupon && (
                        <>
                          <h6>
                            <b>{coupon.discount}%</b>
                          </h6>
                          <h6>
                            {formatPrice(totalPricePlusShipping)} -{" "}
                            {coupon.discount}% ={" "}
                            <b>
                              {formatPrice(
                                discountedPrice(
                                  totalPricePlusShipping,
                                  coupon.discount
                                )
                              )}
                            </b>
                          </h6>
                        </>
                      )}
                    </Col>
                  </Row>

                  <Form.Group className="mt-3">
                    <Form.Label className="me-2">Coupon code:</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        className="form-controls me-2"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        isInvalid={!!couponError}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleApplyCoupon}
                        className="cart-buttons"
                      >
                        Apply coupon
                      </Button>
                    </div>
                    <Form.Control.Feedback
                      type="invalid"
                      className="d-block mt-1"
                    >
                      <b>{couponError}</b>
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    className="mt-3 text-start"
                    controlId="formConfirm"
                  >
                    <Form.Check
                      className="custom-checkbox"
                      type="checkbox"
                      label="I confirm all the details are correct"
                      checked={confirm}
                      onChange={() => setConfirm(!confirm)}
                      isInvalid={!!confirmError}
                    />
                    {confirmError && (
                      <div className="invalid-feedback d-block">
                        <b>{confirmError}</b>
                      </div>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>

              <Row className="cart-buttons-container">
                <Col className="d-flex justify-content-center">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleContinueShopping}
                    className="cart-buttons me-3"
                  >
                    Continue shopping
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleCompleteOrder}
                    className="cart-buttons"
                  >
                    Complete order
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
    // </Container>
  );
};

export default CheckoutPage;
