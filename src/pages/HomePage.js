import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Carousel } from "react-bootstrap";
// import { getRecommendedProducts } from '../services/RecommendationService';
import { useProductContext } from "../contexts/ProductContext";

const HomePage = () => {
  const { allProducts } = useProductContext();
  //   const [recommendedProducts, setRecommendedProducts] = useState([]);

  //   useEffect(() => {
  //     const fetchRecommendedProducts = async () => {
  //       try {
  //         const products = await getRecommendedProducts();
  //         console.log("Fetched recommended products:", products); // Log fetched products
  //         setRecommendedProducts(products);
  //       } catch (error) {
  //         console.error("Error fetching recommended products:", error);
  //       }
  //     };
  //     fetchRecommendedProducts();
  //   }, []);

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="promo-banner">
            <h1>Welcome to Camera Kingdom</h1>
            <p>Your one-stop shop for all camera needs</p>
          </div>
        </Col>
      </Row>
      <h2 className="mb-3">Featured Products</h2>
      <Row>
        <Col>
          <Carousel className="featured-carousel">
            {allProducts.map((product) => (
              <Carousel.Item key={product.id} interval={3000}>
                <img src={product.image1} height={200} alt={product.model} />
                <Carousel.Caption
                  style={{
                    position: "static",
                    paddingtop: "10px",
                    color: "black",
                  }}
                >
                  <h3>{product.model}</h3>
                  <p>{product.brand}</p>
                </Carousel.Caption>
              </Carousel.Item>
              // <Col key={product.id} md={4}>
              //   <Card>
              //     <Card.Title>{product.model}</Card.Title>
              //     <Card.Body>
              //       <Card.Img
              //         variant="top"
              //         src={product.image1}
              //         height={200}
              //         style={{ width: "90%" }}
              //       />
              //       <Card.Text>{product.brand}</Card.Text>
              //       <Card.Text>${product.price}</Card.Text>
              //     </Card.Body>
              //   </Card>
              // </Col>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
