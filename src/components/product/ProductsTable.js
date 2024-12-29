import React from "react";
import { Table, Button, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useValidationContext } from "../../contexts/ValidationContext";
import noImage from "../../assets/no-image.png";

const ProductsTable = ({ products }) => {
  const { formatPrice } = useValidationContext();

  return (
    <Container
      className="mt-4 p-0"
      style={{ maxHeight: "680px", overflowY: "auto" }}
    >
      <Table striped bordered hover responsive className="m-0">
        <thead className="text-center align-middle">
          <tr>
            <th>Image</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Image
                  src={product.images[0] || noImage}
                  alt={`${product.model}`}
                  className="small-product-image"
                  onError={(e) => {
                    e.target.src = noImage;
                  }}
                />
              </td>
              <td>{product.brand}</td>
              <td>{product.model}</td>
              <td>{formatPrice(product.price)}</td>
              <td>
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </td>
              <td>{product.stock}</td>
              <td>
                <Container className="d-flex justify-content-center gap-2">
                  <Link to={`/product/${product.id}`}>
                    <Button variant="primary" size="sm">
                      View
                    </Button>
                  </Link>
                  <Button variant="warning" size="sm">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductsTable;