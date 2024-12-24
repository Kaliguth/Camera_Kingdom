import React from "react";
// import { useWishlistContext } from "../../contexts/WishlistContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import { useCartContext } from "../../contexts/CartContext";
import { useWishlistContext } from "../../contexts/WishlistContext";
import {
  ListGroup,
  Row,
  Col,
  Image,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import RemoveProductAlert from "../alerts/RemoveProductAlert";
import noImage from "../../assets/no-image.png";

const WishlistProductCard = ({ product }) => {
  const { removeFromWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();
  const { formatPrice } = useValidationContext();

  // Remove from wishlist tooltip when hovering over remove button
  const removeProductTooltip = (props) => (
    <Tooltip {...props}>Remove from wishlist</Tooltip>
  );

  const handleAddToCart = () => {
    addToCart(product)
      .then(() => {
        toast.success(`${product.model} added to your cart`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleRemoveFromWishlist = () => {
    RemoveProductAlert(product.model)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return removeFromWishlist(product);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.info(`${product.model} removed from your wishlist`);
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Product removal canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  return (
    <ListGroup.Item className="d-flex align-items-center">
      <Row className="w-100">
        {/* Product Image */}
        <Col
          xs={3}
          md={2}
          className="d-flex flex-column justify-content-between"
        >
          <Link to={`/product/${product.id}`}>
            <Image
              src={product.images[0]}
              alt={product.model}
              height={80}
              className="small-product-image p-2"
              onError={(e) => {
                e.target.src = noImage;
              }}
            />
          </Link>
        </Col>

        {/* Product Name */}
        <Col
          xs={4}
          md={4}
          className="d-flex flex-column justify-content-center"
        >
          {/* <small className="text-muted">Product</small> */}
          <Link to={`/product/${product.id}`} className="black-link-text">
            <h6>
              {product.brand} {product.model}
            </h6>
          </Link>
          <span />
        </Col>

        {/* Unit Price */}
        <Col
          xs={4}
          md={3}
          className="d-flex flex-column justify-content-center"
        >
          {/* <small className="text-muted">Price</small> */}
          <h6>{formatPrice(product.price)}</h6>
          <span />
        </Col>

        {/* Add to Cart Button */}
        <Col
          xs={2}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <Button
            variant="success"
            aria-label="Add to Cart"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Col>

        {/* Remove Button */}
        <Col
          xs={1}
          className="d-flex align-items-center justify-content-center"
        >
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 200 }}
            overlay={removeProductTooltip}
          >
            <Button
              variant="link"
              onClick={handleRemoveFromWishlist}
            >
              <FaTrash color="red" size={22} />
            </Button>
          </OverlayTrigger>
        </Col>
        <hr className="ms-2" />
      </Row>
    </ListGroup.Item>
  );
};

export default WishlistProductCard;
