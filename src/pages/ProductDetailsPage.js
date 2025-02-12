import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";
import Loader from "../components/utility/Loader";
import ProductDetailsCard from "../components/product/ProductDetailsCard";
import ProductReviewsCard from "../components/product/ProductReviewsCard";
import ProductInfoCard from "../components/product/ProductInfoCard";
import ProductsSwiper from "../components/design/ProductsSwiper";
import HomeButtons from "../components/utility/HomeButtons";

// Product details page
const ProductDetails = () => {
  const { productId } = useParams();
  const { getProduct, getRelatedProducts } = useProductContext();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      // Fetch the product
      const fetchedProduct = await getProduct(productId);
      setProduct(fetchedProduct);

      if (fetchedProduct) {
        // Fetch related products
        const related = getRelatedProducts(fetchedProduct);
        setRelatedProducts(related);
      }
    };

    fetchProductAndRelated();
  }, [productId, getProduct, getRelatedProducts]);

  if (!product) {
    return <Loader />;
  }

  return (
    <Container className="custom-container mt-4 mb-4">
      <ProductDetailsCard product={product} />
      <hr className="thick-hr" />

      <Row>
        <h4 className="text-center">Product Information</h4>
        <ProductInfoCard product={product} />
      </Row>
      <hr className="thick-hr" />

      <Row>
        <h4 className="text-center">Related products</h4>
        {/* {relatedProducts.map((relatedProduct) => (
          <SmallProductCard key={relatedProduct.id} product={relatedProduct} />
        ))} */}
        <ProductsSwiper products={relatedProducts} />
      </Row>
      <hr className="thick-hr" />

      <Row>
        <Col>
          <ProductReviewsCard product={product} />
        </Col>
      </Row>
      <HomeButtons size={"md"} />
    </Container>
  );
};

export default ProductDetails;
