import React from "react";
import { useValidationContext } from "../../contexts/ValidationContext";
import { Row, Col, Card, Button } from "react-bootstrap";
import OrderProductCard from "./OrderProductCard";

const OrderDetailsCard = ({ order }) => {
  const { formatPrice } = useValidationContext();

  return (
    <Card className="custom-card mt-3" style={{ backgroundColor: "whitesmoke" }}>
      <Card.Header>
        <h3>
          <u>Order Details</u>
        </h3>
      </Card.Header>

      <Card.Body>
        <Row className="m-3">
          <h5>
            <b>Order Number: {order.orderNumber}</b>
          </h5>
          <p>
            <b>Order Date:</b> {order.purchase.date}
          </p>
        </Row>

        <Row className="justify-content-center mb-3">
          <Card className="order-container w-75 mb-4">
            <Card.Header className="mb-3">
              <h5 className="m-3">Products</h5>
            </Card.Header>
            {order.purchase.products.map((product) => (
              <OrderProductCard key={product.id} product={product} />
            ))}
          </Card>
        </Row>

        <Row className="row-print-flex justify-content-center mb-3">
          <Col md={3} className="col-print-flex mb-3">
            <h4>
              <u>Contact Information</u>
            </h4>
            <h6>
              <b>Name:</b> {order.customer.fullName}
            </h6>
            <h6>
              <b>Phone Number:</b> {order.customer.phoneNumber}
            </h6>
            <h6>
              <b>Email:</b> {order.customer.email}
            </h6>
          </Col>

          <Col md={3} className="col-print-flex mb-3">
            <h4>
              <u>Shipping Information</u>
            </h4>
            <h6>
              <b>Address:</b> {order.shipping.streetName}{" "}
              {order.shipping.houseNumber}
            </h6>
            <h6>
              <b>City:</b> {order.shipping.city}
            </h6>
            <h6>
              <b>Delivery Option:</b> {order.shipping.deliveryOption}
            </h6>
            {order.shipping.deliveryInfo.trim() !== "" && (
              <h6>
                <b>Additional Delivery Information:</b>{" "}
                {order.shipping.deliveryInfo}
              </h6>
            )}
          </Col>

          <Col md={3} className="col-print-flex mb-3">
            <h4>
              <u>Payment Summary</u>
            </h4>
            <h6>
              <b>Subtotal:</b> {formatPrice(order.purchase.productsPrice)}
            </h6>
            <h6>
              <b>Shipping:</b> {formatPrice(order.purchase.shippingPrice)}
            </h6>
            {order.purchase.coupon ? (
              <>
                <h6>
                  <b>Coupon:</b> {order.purchase.coupon}
                </h6>
                <h6>
                  <b>Discount:</b> {order.purchase.discount}
                </h6>
                <h6>
                  <b>Total:</b> {formatPrice(order.purchase.discountedPrice)}
                </h6>
              </>
            ) : (
              <h6>
                <b>Total:</b> ${order.purchase.totalPrice.toFixed(2)}
              </h6>
            )}
          </Col>
        </Row>

        <Row className="mt-3 hide-on-print">
          <Col>
            <Button
              variant="secondary"
              className="m-2"
              onClick={() => window.print()}
            >
              Print Invoice
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default OrderDetailsCard;
