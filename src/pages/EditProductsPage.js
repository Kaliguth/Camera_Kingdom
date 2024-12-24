import React, { useState, useEffect } from "react";
import { db } from "../firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Table,
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";
import { useValidationContext } from "../contexts/ValidationContext";
import ProductImagesSwiper from "../components/design/ProductImagesSwiper";
import { logoMap } from "../assets/LogoMap";
import noImage from "../assets/no-image.png";

const EditProductsPage = () => {
  const { allProducts } = useProductContext();
  const { formatPrice, largeSquareLogoStyle } = useValidationContext();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    brand: "",
    category: "",
    image1: "",
    model: "",
    price: "",
    type: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const productCollection = await getDocs(collection(db, "products"));
      setProducts(
        productCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setNewProduct({
      brand: product.brand,
      category: product.category,
      image1: product.image1,
      model: product.model,
      price: product.price,
      type: product.type,
    });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <Container className="custom-container mt-4">
      <hr />
      <h3>Edit Products</h3>
      <h5>Select a product:</h5>

      <Row className="g-5 mt-2">
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
                {/* <Card.Text><b>Model:</b> {product.model}</Card.Text> */}
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
              </Card.Body>
              <Row className="mt-3">
                <Col>
                  <Button variant="warning">Edit</Button>
                </Col>
                <Col>
                  <Button variant="danger">Delete</Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.brand}</td>
              <td>{product.model}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>
                <img
                  src={product.image1}
                  alt={product.name}
                  style={{
                    width: "100px",
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </td>
              <td>{product.type}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}

      <Link to="/admin-dashboard/products">
        <Button variant="warning" size="md" className="mt-4">
          Close
        </Button>
      </Link>
    </Container>
  );
};

export default EditProductsPage;
