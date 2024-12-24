import React from "react";
import { Container, Row } from "react-bootstrap";
import CategoryCard from "../components/product/CategoryCard";
import HomeButtons from "../components/utility/HomeButtons";

const CategoriesPage = () => {
  return (
    <Container className="custom-container mt-4">
      <Row className="m-4">
        <h2>Categories</h2>
      </Row>
      <Row className="d-flex justify-content-center">
        <CategoryCard category="cameras" size="lg" />
        <CategoryCard category="lenses" size="lg" />
        <CategoryCard category="accessories" size="lg" />
        <CategoryCard category="bags" size="lg" />
        <CategoryCard category="tripods" size="lg" />
        <CategoryCard category="lighting" size="lg" />
      </Row>

      <HomeButtons size={"md"} />
    </Container>
  );
};

export default CategoriesPage;
