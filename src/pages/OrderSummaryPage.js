import React from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderSummaryPage = ({ order }) => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Thank You for Your Purchase!</h1>
          <p className="text-center text-muted">
            Your order has been successfully placed. Below is a summary of your purchase.
          </p>
          <div className="order-summary mt-4">
            <h4>Order Details</h4>
            <p><strong>Order Number:</strong> {order.orderNumber}</p>
            <p><strong>Order Date:</strong> {order.orderDate}</p>
          </div>
          <div className="order-items mt-4">
            <h4>Items Purchased</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="order-summary mt-4">
            <h4>Summary</h4>
            <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
            <p><strong>Discount:</strong> ${order.discount.toFixed(2)}</p>
            <p><strong>Tax:</strong> ${order.tax.toFixed(2)}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          </div>
          <div className="shipping-info mt-4">
            <h4>Shipping Information</h4>
            <p><strong>Name:</strong> {order.shipping.name}</p>
            <p><strong>Address:</strong> {order.shipping.address}</p>
            <p><strong>Contact:</strong> {order.shipping.contact}</p>
          </div>
          <div className="mt-4 text-center">
            <Button variant="success" onClick={() => navigate("/")}>
              Back to Home
            </Button>{" "}
            <Button variant="primary" onClick={() => navigate("/categories")}>
              Shop More
            </Button>{" "}
            <Button variant="outline-secondary" onClick={() => window.print()}>
              Print Invoice
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSummaryPage;
