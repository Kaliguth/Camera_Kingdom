import React from "react";
import Loader from "../components/utility/Loader";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useAuthContext } from "../contexts/AuthContext";
import { useWishlistContext } from "../contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import WishlistProductCard from "../components/wishlist/WishlistProductCard";
import HomeButtons from "../components/utility/HomeButtons";

// Wishlist page
const WishlistPage = () => {
  const { currentUser, userLoading } = useAuthContext();
  const { wishlist, wishlistLoading } = useWishlistContext();
  const navigate = useNavigate();

  const handleGoToCart = () => {
    navigate("/cart");
  };
  const handleContinueShopping = () => {
    navigate("/categories");
  };

  if (userLoading || wishlistLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <h5>Please log in to view your wishlist</h5>
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
    <Container className="custom-container">
      <Row className="m-4">
        <h2>Wishlist</h2>
      </Row>
      {wishlist.length === 0 ? (
        <>
          <h5>Your wishlist is empty!</h5>
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
                  <h5 className="m-3">Wishlist products</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col xs={5} md={5}>
                      <small className="text-muted">Product</small>
                    </Col>
                    <Col xs={4} md={4}>
                      <small className="text-muted ms-5 ps-4">Price</small>
                    </Col>
                    <Col xs={3} md={3}>
                      <small className="text-muted">Actions</small>
                    </Col>
                  </Row>
                  {wishlist.map((product) => (
                    <WishlistProductCard key={product.id} product={product} />
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center m-4">
            <Col md={4}>
              <Row className="cart-buttons-container">
                <Col className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    size="md"
                    className="cart-buttons me-3"
                    onClick={handleGoToCart}
                  >
                    Go to cart
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleContinueShopping}
                    className="cart-buttons"
                  >
                    Continue shopping
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default WishlistPage;
