import React from "react";
import { useValidationContext } from "../../contexts/ValidationContext";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logoMap } from "../../assets/LogoMap";
import noImage from "../../assets/noImage.png";

const FeaturedCard = ({ product }) => {
  const logo = logoMap[product.brand] || null;
  const { formatPrice, smallSquareLogoStyle } = useValidationContext();

  return (
    <Card className="small-product-card">
      <Link to={`/product/${product.id}`} className="black-link-text">
        <Card.Img
          variant="top"
          src={product.images[0]}
          className="small-product-image"
          onError={(e) => {
            e.target.src = noImage;
          }}
        />
        <Card.Img
          variant="top"
          src={logo}
          className="small-product-brand-logo"
          style={smallSquareLogoStyle(product.brand)}
        />
      </Link>
      <Card.Body>
        <Card.Title className="small-product-title">
          <b>
            {product.brand} {product.model}
          </b>
        </Card.Title>
        <Card.Text className="small-price-text">
          {formatPrice(product.price)}
        </Card.Text>
      </Card.Body>
      <Link to={`/product/${product.id}`}>
        <Button variant="primary" size="sm" className="small-product-button">
          More details
        </Button>
      </Link>
    </Card>
  );
};

export default FeaturedCard;
