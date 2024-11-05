import React from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import { Button, Card, Row, Col, ListGroup, Image } from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoginToPurchaseAlert from "../alerts/LoginToPurchaseAlert";

const ProductDetailsCard = ({ product }) => {
  const { currentUser } = useAuthContext();
  const { addToCart } = useCartContext();
  const { formatPrice, largeSquareLogoStyle } = useValidationContext();
  const logo = logoMap[product.brand] || null;
  const navigate = useNavigate();

  const handleAddToCart = () => {
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
        toast.success(`${product.model} added to your cart`);
      })
      .catch((error) => {
        toast.error(error);
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
    <Card>
        <Row>
          <Col md={6} className="product-images-container">
            <Image
              className="mt-5"
              src={product.images[0]}
              fluid
              style={{ maxHeight: "300px", width: "auto" }}
            />
          </Col>
          <Col md={6} className="mt-4 pe-4">
            <h2>
              <b>
                {product.brand} {product.model}
              </b>
            </h2>

            <hr />
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Brand:</strong> {product.brand}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Model:</strong> {product.model}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Type:</strong> {product.type}
              </ListGroup.Item>
            </ListGroup>
            <hr />

            <h5><b>About this product:</b></h5>
            <small>{product.description}</small>
            <hr />

            <div className="d-inline-block mt-0 mb-3">
              <h3 className="d-inline me-4">{formatPrice(product.price)}</h3>
              <Button variant="success" size="lg" className="me-2" onClick={handleBuyNow}>
                Buy now
              </Button>
              <Button variant="primary" size="lg" className="me-2" onClick={handleAddToCart}>
                Add to cart
              </Button>
              <Button variant="secondary" size="lg">
                Add to Wishlist
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
  );
};

export default ProductDetailsCard;
