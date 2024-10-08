import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import InputSpinner from "react-bootstrap-input-spinner";
import { useAuthContext } from "../contexts/AuthContext";
import { useCartContext } from "../contexts/CartContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { currentUser } = useAuthContext();
  const { cart, removeFromCart, handleQuantityChange, completeOrder } =
    useCartContext();
  const navigate = useNavigate();
  console.log(cart);

  let orderTotal = 0;
  cart.forEach((product) => {
    orderTotal += product.price * product.quantity;
  });

  const handleContinueShopping = () => {
    navigate("/categories");
  };

  if (!currentUser) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <p>Please log in to view your cart.</p>
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
    <Container>
      <Row className="mt-4 mb-3">
        <h2>Shopping Cart</h2>
      </Row>
      {cart.length === 0 ? (
        <Container>
          <h6>(Your cart is empty)</h6>
          <Button
            variant="success"
            size="lg"
            className="m-4"
            onClick={() => navigate("/categories")}
          >
            Start shopping
          </Button>
          <br />
          <Button className="m-2" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button className="m-2" onClick={() => navigate("/")}>
            Home
          </Button>
        </Container>
      ) : (
        <Container>
          <h6 className="mb-3">({cart.length} items in your cart)</h6>
          {cart.map((product) => (
            <Card key={product.id} className="cart-card">
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Card.Img
                      variant="small"
                      src={product.image1}
                      alt={product.model}
                      height={100}
                      className="p-2"
                    />
                  </Col>
                  <Col md={2}>
                    <p className="small text-muted pb-2">Name</p>
                    <h6 className="mt-3">
                      {product.brand} {product.model}
                    </h6>
                  </Col>
                  <Col md={2}>
                    <p className="small text-muted pb-2">Quantity</p>
                    <Row className="d-flex justify-content-center">
                      <Container className="quantity-input-container">
                        <InputSpinner
                          type="int"
                          precision={0}
                          max={100}
                          min={1}
                          step={1}
                          value={product.quantity}
                          onChange={(newQuantity) =>
                            handleQuantityChange(product.id, newQuantity)
                          }
                        />
                      </Container>
                      {/* <Button
                        variant="light"
                        className="cart-quantity-buttons btn-lg"
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        className="text-center w-25"
                        value={product.quantity}
                        min="1"
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value, 10 || 1)
                          )
                        }
                      />
                      <Button
                        variant="light"
                        className="cart-quantity-buttons btn-lg"
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity + 1)
                        }
                      >
                        +
                      </Button>
                      <h6 className="mt-2 pt-1">{product.quantity}</h6> */}
                    </Row>
                  </Col>
                  <Col md={2}>
                    <p className="small text-muted pb-2">Unit price</p>
                    <h6 className="mt-3 pt-2">₪ {product.price}</h6>
                  </Col>
                  <Col md={2}>
                    <p className="small text-muted pb-2">Total</p>
                    <h6 className="mt-3 pt-2">
                      ₪ {product.price * product.quantity}
                    </h6>
                  </Col>
                  <Col md={1} className=" mt-4 pt-3">
                    <Button variant="link" aria-label="Remove button">
                      <FaTrash
                        color="red"
                        size={22}
                        onClick={() => removeFromCart(product)}
                      />
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <Card className="cart-card mt-5 mb-3 w-25 ms-auto">
            <Card.Body className="p-2 mt-3">
              <Row>
                <Col className="d-flex">
                  <p className="small text-muted ms-4 me-5">Order total:</p>
                  <h6>
                    <b>₪ {orderTotal}</b>
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
                onClick={completeOrder}
              >
                Buy now
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </Container>
  );
};

export default CartPage;
