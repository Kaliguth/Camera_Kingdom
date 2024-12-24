import React from "react";
import { useCartContext } from "../../contexts/CartContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import {
  ListGroup,
  Row,
  Col,
  Button,
  Image,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import QuantityInput from "../utility/QuantityInput";
import RemoveProductAlert from "../alerts/RemoveProductAlert";
import noImage from "../../assets/no-image.png";

const CartProductCard = ({ product }) => {
  const { removeFromCart, changeQuantity } = useCartContext();
  const { formatPrice } = useValidationContext();

  // Remove from cart tooltip when hovering over remove button
  const removeProductTooltip = (props) => (
    <Tooltip {...props}>Remove from cart</Tooltip>
  );

  const handleQuantityChange = (newQuantity) => {
    changeQuantity(product.id, newQuantity).catch((error) => {
      // Show warning if invalid quantity or error if quantity change failed
      if (!error.message.includes("Failed")) {
        toast.warning(error.message);
      } else {
        toast.error(error.message);
      }
    });
  };

  const handleRemoveFromCart = () => {
    RemoveProductAlert(product.model)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return removeFromCart(product);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.info(`${product.model} removed from your cart`);
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
          className="d-flex flex-column justify-content-center"
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
          md={3}
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

        {/* Quantity Input */}
        <Col
          xs={3}
          md={2}
          className="d-flex flex-column justify-content-center"
        >
          {/* <small className="text-muted">Quantity</small> */}
          <QuantityInput
            defaultValue={product.quantity}
            min={1}
            max={product.stock <= 100 ? product.stock : 100}
            step={1}
            onChange={(_, newQuantity) => handleQuantityChange(newQuantity)}
          />
        </Col>

        {/* Unit Price */}
        <Col
          xs={3}
          md={2}
          className="d-flex flex-column justify-content-center"
        >
          {/* <small className="text-muted">Unit Price</small> */}
          <h6>{formatPrice(product.price)}</h6>
          <span />
        </Col>

        {/* Total Price */}
        <Col
          xs={3}
          md={2}
          className="d-flex flex-column justify-content-center"
        >
          {/* <small className="text-muted">Total</small> */}
          <h6>{formatPrice(product.price * product.quantity)}</h6>
          <span />
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
            <Button variant="link" onClick={handleRemoveFromCart}>
              <FaTrash color="red" size={22} />
            </Button>
          </OverlayTrigger>
        </Col>
        <hr className="ms-2" />
      </Row>
    </ListGroup.Item>
  );
};

export default CartProductCard;
