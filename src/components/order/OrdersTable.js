import React from "react";
import { Link } from "react-router-dom";
import { useOrderManagementContext } from "../../contexts/OrderManagementContext";
import { Table, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import DeleteOrderAlert from "../alerts/DeleteOrderAlert";
import ConfirmOrderAlert from "../alerts/ConfirmOrderAlert";
import RefundOrderAlert from "../alerts/RefundOrderAlert";

// Table to show orders in admin dashboard
const OrdersTable = ({ orders, action }) => {
  const { deleteOrder, confirmOrder, refundOrder } =
    useOrderManagementContext();

  // Delete order handle
  const handleDeleteOrder = (order) => {
    DeleteOrderAlert(order)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return deleteOrder(order.id);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success(
          `Order number ${order.orderNumber} has been successfully deleted`
        );
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Order deletion canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  // Confirm order handle
  const handleConfirmOrder = (order) => {
    ConfirmOrderAlert(order)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return confirmOrder(order.id);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success(
          `Order number ${order.orderNumber} has been successfully confirmed`
        );
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Order confirmation canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  // Refund order handle
  const handleRefundOrder = (order) => {
    RefundOrderAlert(order)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return refundOrder(order.id);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success(
          `Order number ${order.orderNumber} has been successfully refunded`
        );
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Order refund canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  return (
    <Container
      className="mt-4 p-0"
      style={{ maxHeight: "595px", overflowY: "auto" }}
    >
      <Table striped bordered hover responsive className="m-0">
        <thead className="text-center align-middle">
          <tr>
            <th>Order ID</th>
            <th>Order Number</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Delivery Option</th>
            <th>Number of Products</th>
            <th>Total Price</th>
            <th>status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody className="text-center align-middle">
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderNumber || "Unavailable"}</td>
              <td>{order.customer.fullName}</td>
              <td>{order.purchase.date}</td>
              <td>{order.shipping.deliveryOption}</td>
              <td>{order.purchase.products.length}</td>
              <td>{order.purchase.discountedPrice}</td>
              <td>{order.status}</td>
              <td>
                {/* Different buttons based on action */}
                <Container className="d-flex justify-content-center gap-2">
                  {action === "view" ? (
                    <>
                      <Link to={`/admin-dashboard/orders/view/${order.id}`}>
                        <Button variant="primary" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link to={`/admin-dashboard/orders/edit/${order.id}`}>
                        <Button variant="warning" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteOrder(order)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : action === "confirm" ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirmOrder(order)}
                      >
                        Confirm Order
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleRefundOrder(order)}
                      >
                        Refund Order
                      </Button>
                    </>
                  )}
                </Container>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrdersTable;
