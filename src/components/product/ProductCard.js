import React from "react";
import { Button, Card } from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";
import { useProductContext } from "../../contexts/ProductContext";
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
      <Card.Title>
        {product.brand} {product.model}
      </Card.Title>
      <Card.Body>
        <Card.Img variant="top" src={product.image1} height={200} />
        <Card.Img
          src={logo}
          className="product-brand-logo mt-3 mb-3"
          style={squareLogoStyle}
        />
        <Card.Text>{product.price}₪ ILS</Card.Text>
      </Card.Body>
      <Button variant="success" className="product-buttons">
        Buy now
      </Button>
      <Button
        variant="success"
        className="product-buttons"
        onClick={handleAddToCart}
      >
        Add to cart
      </Button>
    </Card>
  );
};

export default ProductCard;
