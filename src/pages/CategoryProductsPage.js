import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";
import Loader from "../components/utility/Loader";
import ProductCard from "../components/product/ProductCard";

const CategoryProductsPage = () => {
  const { category } = useParams();
  const { productsLoading, allProducts } = useProductContext();
  const navigate = useNavigate();

  // Filter products based on the category in the URL
  const filteredProducts = allProducts.filter(
    (product) => product.category.toLowerCase() === category
  );

  const categoryUpperCaseLetter =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  if (productsLoading) {
    return <Loader />;
  }

  return (
    <Container className="custom-container mt-4">
      <Row>
        <h2>{categoryUpperCaseLetter}</h2>
      </Row>
      {filteredProducts.length === 0 ? (
        <Row className="m-4">
          <Col>
            <p>No products found for {category}</p>
          </Col>
        </Row>
      ) : (
        <Row className="m-3">
          {filteredProducts.map((product) => (
            //                                                                      EXAMPLE FOR RESPONSIVE HERE
            <Col key={product.id} xs={6} sm={5} md={4} lg={3} className="mb-3">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
      <Row className="custom-centered-buttons-container">
        <Button
          className="m-2 custom-centered-buttons"
          onClick={() => navigate(-1)}
        >
          Go back
        </Button>
        <Button
          className="m-2 custom-centered-buttons"
          onClick={() => navigate("/")}
        >
          Home
        </Button>
      </Row>
    </Container>
  );
};

export default CategoryProductsPage;
