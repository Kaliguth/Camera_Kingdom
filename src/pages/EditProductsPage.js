import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";
import ProductsTable from "../components/product/ProductsTable";

const EditProductsPage = () => {
  const { allProducts } = useProductContext();

  // Search and sort states
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("brand-A-Z");
  const [filterCategory, setFilterCategory] = useState("All");

  // Method to filter and sort products depending on above states
  const filteredProducts = allProducts
    .filter((product) => {
      const input = searchInput.toLowerCase();
      return (
        product.brand?.toLowerCase().includes(input) ||
        product.model?.toLowerCase().includes(input) ||
        product.type?.toLowerCase().includes(input) ||
        product.price.toString().includes(input)
      );
    })
    .filter((product) => {
      if (filterCategory === "All") return product;
      return product.category?.toLowerCase() === filterCategory.toLowerCase();
    })
    .sort((a, b) => {
      const brandA = a.brand?.toLowerCase() || "";
      const brandB = b.brand?.toLowerCase() || "";
      const modelA = a.model?.toLowerCase() || "";
      const modelB = b.model?.toLowerCase() || "";
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      const stockA = a.stock || 0;
      const stockB = b.stock || 0;

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
      } else if (sortOrder === "price-desc") {
        return priceB - priceA;
      } else if (sortOrder === "stock-asc") {
        return stockA - stockB;
      } else if (sortOrder === "stock-desc") {
        return stockB - stockA;
      }
      return 0;
    });

  // Clear filters handle
  const handleResetFilters = () => {
    setSearchInput("");
    setSortOrder("brand-A-Z");
    setFilterCategory("All");
  };

  return (
    <Container className="custom-container">
      <hr className="thick-hr m-5" />
      <Card className="custom-card">
        <Card.Header>
          <h3>
            <u>Edit Products</u>
          </h3>
        </Card.Header>

        <Card.Body>
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
                <option value="stock-asc">Stock: Ascending</option>
                <option value="stock-desc">Stock: Descending</option>
              </Form.Select>
            </Col>
            <Col lg={2} md={6} sm={5} xs={5} className="mb-3">
              <h6>
                <b>Filter:</b>
              </h6>
              <Form.Select
                className="form-controls"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Cameras">Cameras</option>
                <option value="Lenses">Lenses</option>
                <option value="Accessories">Accessories</option>
                <option value="Bags">Bags</option>
                <option value="Tripods">Tripods</option>
                <option value="Lighting">Lighting</option>
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

          <h6>(Scroll for more products)</h6>
          <ProductsTable products={filteredProducts} />

          {/* <Row className="g-5 mt-2">
        {allProducts.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="edit-product-card">
              <ProductImagesSwiper product={product} size={"small"} />
              <Card.Img
                src={logoMap[product.brand] || null}
                className="product-brand-logo"
                style={largeSquareLogoStyle(product.brand)}
                onError={(e) => {
                  e.target.src = noImage;
                }}
              />

              <Card.Body>
                <Card.Title className="mb-3">
                  <b>
                    {product.brand} <br /> {product.model}
                  </b>
                </Card.Title>
                <Card.Text>
                  <b>Price:</b> {formatPrice(product.price)}
                </Card.Text>
                <Card.Text>
                  <b>Category:</b>{" "}
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1).toLowerCase()}
                </Card.Text>
                <Card.Text>
                  <b>Type:</b> {product.type}
                </Card.Text>
                <Card.Text>
                  <b>Stock:</b> {product.stock}
                </Card.Text>
              </Card.Body>
              <Row>
                <Col>
                  <Link to={`/product/${product.id}`}>
                    <Button
                      variant="primary"
                      size="md"
                      className="custom-button"
                    >
                      Product Page
                    </Button>
                  </Link>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Button variant="warning" size="md" className="custom-button">
                    Edit
                  </Button>
                </Col>
                <Col>
                  <Button variant="danger" size="md" className="custom-button">
                    Delete
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row> */}
        </Card.Body>
      </Card>

      <Link to="/admin-dashboard/products">
        <Button variant="warning" size="md" className="mt-4">
          Close
        </Button>
      </Link>
    </Container>
  );
};

export default EditProductsPage;
