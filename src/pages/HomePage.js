import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useProductContext } from "../contexts/ProductContext";
import { Link } from "react-router-dom";
import AdCarousel from "../components/design/AdCarousel";
import CategoryCard from "../components/product/CategoryCard";
import ProductsSwiper from "../components/design/ProductsSwiper";
import BrandsSwiper from "../components/design/BrandsSwiper";

const HomePage = () => {
  const { getFeaturedProducts } = useProductContext();
  const featuredProducts = getFeaturedProducts();

  return (
    <Container fluid className="p-0 mb-5">
      {/* Automaitc ad carousel */}
      <AdCarousel />

      <Container className="custom-container mt-4">
        {/* Welcome message */}
        <Row className="mb-4">
          <Col>
            <h1>Welcome to Camera Kingdom</h1>
            <h5>Where quality meets affordability.</h5>
            <h5>
              <b>Capture every moment!</b>
            </h5>
          </Col>
        </Row>

        {/* Quick access categories */}
        <Card className="order-container bg-light p-1 mb-5">
          <Row className="ms-2 mt-2">
            <Col>
              <CategoryCard category="cameras" size="sm" />
            </Col>
            <Col>
              <CategoryCard category="lenses" size="sm" />
            </Col>
            <Col>
              <CategoryCard category="accessories" size="sm" />
            </Col>
            <Col>
              <CategoryCard category="bags" size="sm" />
            </Col>
            <Col>
              <CategoryCard category="tripods" size="sm" />
            </Col>
            <Col>
              <CategoryCard category="lighting" size="sm" />
            </Col>
          </Row>
        </Card>

        {/* Featured products (Selected by number of likes and reviews) */}
        <h2 className="mb-3">Featured Products</h2>
        <Card className="order-container bg-light p-1 mb-5">
          <Row className="justify-content-center">
            <Col>
              <ProductsSwiper products={featuredProducts} />
            </Col>
          </Row>
        </Card>

        {/* Brand carousel */}
        <h2 className="mb-3">Our Brands</h2>
        <Card className="order-container bg-light p-1 mb-5">
          <Row>
            <Col>
              <BrandsSwiper />
            </Col>
          </Row>
        </Card>
      </Container>

      <Container className="custom-container">
        {/* Customer Reviews */}
        <Row className="mb-4">
          <h2 className="mt-2 mb-3">What Our Customers Say</h2>
          <Col md={4}>
            <p>
              <b>
                "Professional service and amazing products!!!" - Liam Carter
              </b>
            </p>
          </Col>
          <Col md={4}>
            <p>
              <b>"I highly recommend Camera Kingdom!" - Sophia Bennett</b>
            </p>
          </Col>
          <Col md={4}>
            <p>
              <b>
                "My go-to place for all camera needs. Very affordable!" - Ethan
                Patel
              </b>
            </p>
          </Col>
        </Row>

        {/* Why shop with us */}
        <Card className="custom-card mt-0">
          <Row>
            <Col>
              <h2>
                <b>Why Shop With Us?</b>
              </h2>
              <h5 className="mt-4 mb-0">
                At Camera Kingdom, we offer the latest camera models, expert
                advice, and exceptional customer service. Enjoy competitive
                pricing, fast shipping, and a wide selection of accessories.
                Your satisfaction is our priority.
              </h5>

              {/* Button to navigate to categories page */}
              <Link to={"/categories"}>
                <Button variant="success" size="lg" className="mt-4 mb-3">
                  Start shopping!
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </Container>
    </Container>
  );
};

export default HomePage;
