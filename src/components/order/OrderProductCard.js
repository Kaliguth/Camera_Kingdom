import React from "react";
import { useValidationContext } from "../../contexts/ValidationContext";
import { ListGroup, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import noImage from "../../assets/no-image.png";

// Product card to show products of an order
const OrderProductCard = ({ product }) => {
  const { formatPrice } = useValidationContext();

  return (
    <ListGroup.Item className="d-flex align-items-center">
      <Row className="w-100">
        {/* Product Image */}
        <Col
          lg={3} md={3} sm={3} xs={3}
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
          lg={2} md={2} sm={4} xs={9}
          className="d-flex flex-column justify-content-center"
        >
          <small className="text-muted mb-2">Product Name</small>
          <Link to={`/product/${product.id}`} className="black-link-text">
            <h6>
              {product.brand} {product.model}
            </h6>
          </Link>
        </Col>

        {/* Quantity number */}
        <Col
          lg={2} md={2} sm={4} xs={6}
          className="d-flex flex-column justify-content-center ms-2"
        >
          <small className="text-muted mb-2">Quantity</small>
          <h6>{product.quantity}</h6>
        </Col>

        {/* Unit Price */}
        <Col
          lg={2} md={2} sm={4} xs={5}
          className="d-flex flex-column justify-content-center ms-2"
        >
          <small className="text-muted mb-2">Unit Price</small>
          <h6>{formatPrice(product.price)}</h6>
        </Col>

        {/* Total Price */}
        <Col
          lg={2} md={2} sm={4} xs={4}
          className="d-flex flex-column justify-content-center ms-1"
        >
          <small className="text-muted mb-2">Total</small>
          <h6>{formatPrice(product.price * product.quantity)}</h6>
        </Col>

        <hr className="ms-2" />
      </Row>
    </ListGroup.Item>
  );
};

export default OrderProductCard;
