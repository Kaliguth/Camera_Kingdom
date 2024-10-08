import React from "react";
import { Button, Card, Row } from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";
import { useProductContext } from "../../contexts/ProductContext";
import { Link } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCartContext();
  const logo = logoMap[product.brand] || null;

  const squareLogoStyle =
    product.brand === "Nikon" ||
    product.brand === "Leica" ||
    product.brand === "Zeiss" ||
    product.brand === "DJI" ||
    product.brand === "Insta360"
      ? { width: "70px", height: "70px" }
      : {};

  const handleAddToCart = async () => {
    await addToCart(product);
    alert(`${product.model} added to your cart`);
  };

  return (
    <Card className="product-card">
      <Link to={`/product/${product.id}`} className="black-link-text">
        <Card.Img
          variant="top"
          src={product.image1}
          className="product-image mt-3 mb-3"
        />
        <span>
          <br />
        </span>
        <Card.Img
          src={logo}
          className="product-brand-logo mt-3 mb-3"
          style={squareLogoStyle}
        />
      </Link>
      <Card.Title className="mt-2">
        {product.brand} <br /> {product.model}
      </Card.Title>
      <Card.Body>
        <Card.Text className="price-text">₪ {product.price}</Card.Text>
      </Card.Body>
      {/* <Row className="product-buttons-container"> */}
      <div className="product-buttons-container">
        <Button
          variant="success"
          className="product-buttons"
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
        {/* <span></span> */}
        <Link to={`/product/${product.id}`}>
          <Button variant="primary" className="product-buttons">
            More details
          </Button>
        </Link>
      </div>
      {/* </Row> */}
    </Card>
  );
};

export default ProductCard;
