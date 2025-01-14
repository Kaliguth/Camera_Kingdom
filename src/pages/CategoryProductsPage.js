import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";
import Loader from "../components/utility/Loader";
import ProductCard from "../components/product/ProductCard";
import HomeButtons from "../components/utility/HomeButtons";

// Page to show products based on category in params
const CategoryProductsPage = () => {
  const { category } = useParams();
  const { productsLoading, allProducts } = useProductContext();

  const categoryUpperCaseLetter =
    category.charAt(0).toUpperCase() + category.slice(1);

  // Search and sort states
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("brand-A-Z");
  const [filterType, setFilterType] = useState("All");

  // Method to filter and sort products depending on above states
  const filteredProducts = allProducts
    .filter((product) => {
      const input = searchInput.toLowerCase();

      return (
        product.category === category &&
        (product.brand?.toLowerCase().includes(input) ||
          product.model?.toLowerCase().includes(input) ||
          product.type?.toLowerCase().includes(input) ||
          product.price?.toString().includes(input))
      );
    })
    .filter((product) => {
      if (filterType === "All") return product;
      return product.type === filterType;
    })
    .sort((a, b) => {
      const brandA = a.brand?.toLowerCase() || "";
      const brandB = b.brand?.toLowerCase() || "";
      const modelA = a.model?.toLowerCase() || "";
      const modelB = b.model?.toLowerCase() || "";
      const priceA = a.price || 0;
      const priceB = b.price || 0;

      if (sortOrder === "brand-A-Z") {
        return brandA < brandB ? -1 : 1;
      } else if (sortOrder === "brand-Z-A") {
        return brandA > brandB ? -1 : 1;
      } else if (sortOrder === "model-A-Z") {
        return modelA < modelB ? -1 : 1;
      } else if (sortOrder === "model-Z-A") {
        return modelA > modelB ? -1 : 1;
      } else if (sortOrder === "price-asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

  const addedTypes = [];
  const categoryTypes = allProducts
    .filter((product) => product.category === category)
    .map((product) => {
      if (!addedTypes.includes(product.type)) {
        addedTypes.push(product.type);
        return product.type;
      }

      return null;
    })
    .filter(Boolean);

  // Clear filters handle
  const handleResetFilters = () => {
    setSearchInput("");
    setSortOrder("brand-A-Z");
    setFilterType("All");
  };

  if (productsLoading) {
    return <Loader />;
  }

  return (
    <Container className="custom-container mt-4">
      <Row>
        <h2>{categoryUpperCaseLetter}</h2>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col lg={6} md={6} sm={10} xs={10} className="mb-3">
          <h6>
            <b>Search:</b>
          </h6>
          <Form.Control
            className="form-controls"
            type="text"
            placeholder="Search by brand, model, type or price"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </Col>
        <Col lg={2} md={6} sm={5} xs={5}>
          <h6>
            <b>Sort by:</b>
          </h6>
          <Form.Select
            className="form-controls"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="brand-A-Z">Brand: A-Z</option>
            <option value="brand-Z-A">Brand: Z-A</option>
            <option value="model-A-Z">Model: A-Z</option>
            <option value="model-Z-A">Model: Z-A</option>
            <option value="price-asc">Price: Ascending</option>
            <option value="price-desc">Price: Descending</option>
          </Form.Select>
        </Col>
        <Col lg={2} md={6} sm={5} xs={5} className="mb-3">
          <h6>
            <b>Filter:</b>
          </h6>
          <Form.Select
            className="form-controls"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            {categoryTypes.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button
            className="custom-button mt-0 mb-3"
            variant="primary"
            size="sm"
            onClick={() => handleResetFilters()}
          >
            Reset Filters
          </Button>
        </Col>
      </Row>

      {filteredProducts.length === 0 ? (
        <Row className="m-4">
          <Col>
            <p>No products found for {category}</p>
          </Col>
        </Row>
      ) : (
        <>
          <Row className="m-3">
            {filteredProducts.map((product) => (
              <Col
                key={product.id}
                xs={6}
                sm={5}
                md={4}
                lg={3}
                className="mb-3"
              >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}

      <HomeButtons size={"md"} />
    </Container>
  );
};

export default CategoryProductsPage;
