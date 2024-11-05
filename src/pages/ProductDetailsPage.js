import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Form,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";
import { useAuthContext } from "../contexts/AuthContext";
import { db } from "../firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import Loader from "../components/utility/Loader";
import userImage from "../assets/user-nobgnew.png";
import { useValidationContext } from "../contexts/ValidationContext";
import FeaturedCard from "../components/product/FeaturedCard";
import ProductDetailsCard from "../components/product/ProductDetailsCard";
import ProductReviewsCard from "../components/product/ProductReviewsCard";
import ProductInfoCard from "../components/product/ProductInfoCard";

const ProductDetails = () => {
  const { id } = useParams();
  const { getProduct, getRelatedProducts } = useProductContext();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      // Fetch the product
      const fetchedProduct = await getProduct(id);
      setProduct(fetchedProduct);

      if (fetchedProduct) {
        // Fetch related products
        const related = getRelatedProducts(fetchedProduct);
        setRelatedProducts(related);
      }
    };

    fetchProductAndRelated();
  }, [id, getProduct, getRelatedProducts]);

  if (!product) {
    return <Loader />;
  }

  return (
    <Container className="custom-container mt-4 mb-4">
      <ProductDetailsCard product={product} />
      <hr />

      <Row>
        <h4 className="text-center">Product Information</h4>
        <ProductInfoCard product={product} />
      </Row>

      <Row>
        <h4 className="text-center">Related products</h4>
        <Row>
          {relatedProducts.map((relatedProduct) => (
            <FeaturedCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </Row>
      </Row>
      <Row>
        <Col>
          <ProductReviewsCard product={product} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
