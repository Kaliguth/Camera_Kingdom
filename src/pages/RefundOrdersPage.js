import React, { useState } from "react";
import { useOrderManagementContext } from "../contexts/OrderManagementContext";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import OrdersTable from "../components/order/OrdersTable";

// Refund orders page to show orders to refund in admin dashboard
const RefundOrdersPage = () => {
  const { allOrders } = useOrderManagementContext();

  // Search and sort states
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("order-asc");

  // Method to filter out orders that are not pending, filter and sort depending on above states
  const filteredOrders = allOrders
    .filter((order) => order.status === "Completed")
    .filter((order) => {
      const input = searchInput.toLowerCase();

      return (
        order.id?.toLowerCase().includes(input) ||
        order.orderNumber?.toString().includes(input) ||
        order.customer.fullName?.toLowerCase().includes(input)
      );
    })
    .sort((a, b) => {
      const numberA = a.orderNumber || 0;
      const numberB = b.orderNumber || 0;
      const nameA = a.customer.fullName || "";
      const nameB = b.customer.fullName || "";
      const productsA = a.purchase.products.length || 0;
      const productsB = b.purchase.products.length || 0;
      const priceA = a.purchase.discountedPrice || 0;
      const priceB = b.purchase.discountedPrice || 0;

      if (sortOrder === "order-asc") {
        return numberA < numberB ? -1 : 1;
      } else if (sortOrder === "order-desc") {
        return numberA > numberB ? -1 : 1;
      } else if (sortOrder === "customer A-Z") {
        return nameA > nameB ? -1 : 1;
      } else if (sortOrder === "customer Z-A") {
        return nameA < nameB ? -1 : 1;
      } else if (sortOrder === "products-asc") {
        return productsA < productsB ? -1 : 1;
      } else if (sortOrder === "products-desc") {
        return productsA > productsB ? -1 : 1;
      } else if (sortOrder === "price-asc") {
        return priceA < priceB ? -1 : 1;
      } else {
        return priceA > priceB ? -1 : 1;
      }
    });

  // Clear filters handle
  const handleResetFilters = () => {
    setSearchInput("");
    setSortOrder("A-Z");
  };

  return (
    <Container className="custom-container">
      <hr className="thick-hr m-5" />

      <Card className="custom-card">
        <Card.Header>
          <h3>
            <u>Refund Orders</u>
          </h3>
        </Card.Header>

        <Card.Body>
          {filteredOrders.length === 0 ? (
            <>
              <h5 className="m-3 mb-0">No orders eligible for refund found</h5>
            </>
          ) : (
            <>
              <Row className="justify-content-center mb-3">
                <Col lg={6} md={6} sm={10} xs={10} className="mb-3">
                  <h6>
                    <b>Search:</b>
                  </h6>
                  <Form.Control
                    className="form-controls"
                    type="text"
                    placeholder="Search by order ID, number or customer name"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Col>
                <Col lg={3} md={7} sm={8} xs={8} className="mb-3">
                  <h6>
                    <b>Sort by:</b>
                  </h6>
                  <Form.Select
                    className="form-controls text-center"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="order-asc">Order Number: Ascending</option>
                    <option value="order-desc">Order Number: Descending</option>
                    <option value="customer A-Z">Customer Name: A-Z</option>
                    <option value="customer Z-A">Customer Name: Z-A</option>
                    <option value="products-asc">
                      Number of Products: Ascending
                    </option>
                    <option value="products-desc">
                      Number of Products: Descending
                    </option>
                    <option value="price-asc">Price: Ascending</option>
                    <option value="price-desc">Price: Descending</option>
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

              <h6>(Scroll for more orders)</h6>
              <OrdersTable orders={filteredOrders} action={"refund"} />
            </>
          )}
        </Card.Body>
      </Card>

      <Link to="/admin-dashboard/orders">
        <Button variant="warning" size="md" className="mt-4">
          Close
        </Button>
      </Link>
    </Container>
  );
};

export default RefundOrdersPage;
