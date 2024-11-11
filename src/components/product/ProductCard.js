import React from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import { Button, Card, Row, Col } from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginToPurchaseAlert from "../alerts/LoginToPurchaseAlert";

const ProductCard = ({ product }) => {
  const { currentUser } = useAuthContext();
  const { addToCart } = useCartContext();
  const { formatPrice, largeSquareLogoStyle } = useValidationContext();
  const logo = logoMap[product.brand] || null;
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!currentUser) {
      // toast.warning(
      //   "Please login or create an account to add products to your cart"
      // );
      // return;

      LoginToPurchaseAlert()
        .then((isConfirmed) => {
          if (isConfirmed) {
            toast.info("Moving to login page");
            navigate("/login");
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });

      return;
    }

    addToCart(product)
      .then(() => {
        toast.success(`${product.model} added to your cart`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      LoginToPurchaseAlert()
        .then((isConfirmed) => {
          if (isConfirmed) {
            toast.info("Moving to login page");
            navigate("/login");
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });

      return;
    }

    addToCart(product)
      .then(() => {
        toast.success(
          `${product.model} added to your cart. moving to checkout page`
        );
        navigate("/checkout");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <Card className="product-card">
      <Link to={`/product/${product.id}`} className="black-link-text">
        <Card.Img
          variant="top"
          src={product.images[0]}
          className="product-image"
        />
        <Card.Img
          src={logo}
          className="product-brand-logo"
          style={largeSquareLogoStyle(product.brand)}
        />
      </Link>

      <Card.Body>
        <div>
          <Card.Title className="mt-2">
            <b>{product.brand}</b> <br /> {product.model}
          </Card.Title>
          <Card.Text className="price-text">
            {formatPrice(product.price)}
          </Card.Text>
        </div>
      </Card.Body>

      <div className="mt-2">
        {!product.stock || product.stock <= 0 ? (
          <div className="out-of-stock-container">
            <span>OUT OF STOCK</span>
          </div>
        ) : product.stock < 50 ? (
          <div className="low-stock-container">
            <span>ONLY {product.stock} LEFT IN STOCK!</span>
          </div>
        ) : null}
        <Row>
          <Col className="p-1">
            <Button
              variant="primary"
              size="md"
              className="product-buttons"
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock <= 0}
            >
              Add to cart
            </Button>
          </Col>
          <Col className="p-1">
            <Link to={`/product/${product.id}`}>
              <Button variant="primary" size="md" className="product-buttons">
                More details
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="p-1">
            <Button
              variant="success"
              size="lg"
              className="product-buttons w-100 mt-2"
              onClick={handleBuyNow}
              disabled={!product.stock || product.stock <= 0}
            >
              Buy now
            </Button>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default ProductCard;
