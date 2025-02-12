import React from "react";
import { useValidationContext } from "../../contexts/ValidationContext";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logoMap } from "../../assets/LogoMap";
import noImage from "../../assets/no-image.png";

// Small product card to be shows in small swipers/carousels
const SmallProductCard = ({ product }) => {
  const logo = logoMap[product.brand] || noImage;
  const { formatPrice, smallSquareLogoStyle } = useValidationContext();

  return (
    <Card className="small-product-card">
      <Link to={`/product/${product.id}`} className="black-link-text">
        <Card.Img
          className="small-product-image img-fluid"
          variant="top"
          src={product.images[0]}
          alt={`${product.model}`}
          onError={(e) => {
            e.target.src = noImage;
          }}
        />
        <Card.Img
          className="small-product-brand-logo"
          variant="top"
          src={logo}
          alt={`${product.model} logo`}
          style={smallSquareLogoStyle(product.brand)}
          onError={(e) => {
            e.target.src = noImage;
          }}
        />
      </Link>

      <Card.Body>
        <div>
          <Card.Title className="small-product-title">
            <b>
              {product.brand} {product.model}
            </b>
          </Card.Title>
          <Card.Text className="small-price-text">
            {formatPrice(product.price)}
          </Card.Text>
        </div>
      </Card.Body>

      <Link to={`/product/${product.id}`}>
        <Button variant="primary" size="sm" className="small-product-button">
          More details
        </Button>
      </Link>
    </Card>
  );
};

export default SmallProductCard;
