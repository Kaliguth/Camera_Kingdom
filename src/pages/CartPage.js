import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useAuthContext } from "../contexts/AuthContext";
import { useCartContext } from "../contexts/CartContext";
import { useValidationContext } from "../contexts/ValidationContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/utility/Loader";
import CartProductCard from "../components/cart/CartProductCard";
import HomeButtons from "../components/utility/HomeButtons";

const CartPage = () => {
  const { currentUser, userLoading } = useAuthContext();
  const {
    removeOutOfStockProducts,
    cart,
    cartLoading,
    cartProductsNumber,
    cartTotalPrice,
  } = useCartContext();
  const { formatPrice } = useValidationContext();
  const navigate = useNavigate();

  // useEffect to Remove out of stock products from the cart when the user changes
  useEffect(() => {
    if (!userLoading && currentUser) {
      removeOutOfStockProducts();
    }
  }, [userLoading, currentUser, removeOutOfStockProducts]);

  const handleContinueShopping = () => {
    navigate("/categories");
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (userLoading || cartLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <h5>Please log in to view your cart</h5>
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
        <h2>Shopping Cart</h2>
      </Row>
      {cart.length === 0 ? (
        <>
          <h5>Your cart is empty!</h5>
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
                  <h5 className="m-3">Products</h5>
                  {/* <h6 className="mb-3">
                    (There are {cartProductsNumber()} items in your cart)
                  </h6> */}
                </Card.Header>
                <Card.Body>
                  {/* <Row>
                    <Col xs={4} md={4}>
                      <small className="text-muted">Product</small>
                    </Col>
                    <Col xs={3} md={3}>
                      <small className="text-muted ms-5 ps-4">Quantity</small>
                    </Col>
                    <Col xs={2} md={2}>
                      <small className="text-muted" style={{ marginLeft: -33 }}>
                        Unit price
                      </small>
                    </Col>
                    <Col xs={2} md={2}>
                      <small className="text-muted" style={{ marginLeft: -45 }}>
                        Total price
                      </small>
                    </Col>
                    <Col xs={1} md={1}>
                      <small className="text-muted" style={{ marginLeft: -50 }}>
                        Actions
                      </small>
                    </Col>
                  </Row> */}
                  {cart.map((product) => (
                    <CartProductCard key={product.id} product={product} />
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center m-5">
            <Col md={4}>
              <Card className="order-container">
                <Card.Header>
                  <h5>Cart Summary</h5>
                </Card.Header>
                <Card.Body className="text-start">
                  {/* <h6>Total products: {cart.length}</h6> */}
                  <Row>
                    <Col>Total products:</Col>
                    <Col className="text-end">{cartProductsNumber()}</Col>
                  </Row>

                  <hr />
                  <Row className="mt-3">
                    <Col>
                      <h6>Total price:</h6>
                    </Col>
                    <Col className="text-end">
                      <h6>
                        <b>{formatPrice(cartTotalPrice())}</b>
                      </h6>
                    </Col>
                  </Row>
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
                    className="cart-buttons"
                    onClick={handleCheckout}
                  >
                    Go to checkout
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* <Card className="cart-card mt-5 mb-3 w-25 ms-auto">
              <Card.Body className="p-2 mt-3">
                <Row>
                  <Col className="d-flex">
                    <p className="small text-muted ms-4 me-5">Order total:</p>
                    <h6>
                      <b>₪ {cartTotalPrice()}</b>
                    </h6>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

          <Row className="cart-buttons-container">
            <Col className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleContinueShopping}
                className="cart-buttons btn-lg me-3"
              >
                Continue shopping
              </Button>
              <Button
                variant="primary"
                className="cart-buttons btn-lg"
                onClick={handleCheckout}
              >
                Go to checkout
              </Button>
            </Col>
          </Row> */}
        </>
      )}
    </Container>
  );
};

export default CartPage;
