import React, { useEffect, useState } from "react";
import { useOrderManagementContext } from "../contexts/OrderManagementContext";
import { Container, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/utility/Loader";
import OrderDetailsCard from "../components/order/OrderDetailsCard";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { getOrder } = useOrderManagementContext();
  const [orderLoading, setOrderLoading] = useState(true);

  const [order, setOrder] = useState(null);

  // useEffect to fetch the order by id in params
  useEffect(() => {
    const fetchOrder = async () => {
      setOrderLoading(true);

      // Fetch the order
      const fetchedOrder = await getOrder(orderId);
      setOrder(fetchedOrder);
    };

    fetchOrder();
    setOrderLoading(false);
  }, [orderId, getOrder]);

  if (orderLoading) {
    return <Loader />;
  }

  if (!order) {
    return <Loader />;
  }

  return (
    <Container className="custom-container">
      <hr className="thick-hr m-5 hide-on-print" />

      <OrderDetailsCard order={order} />

      <Link to="/admin-dashboard/orders/view" className="hide-on-print">
        <Button variant="warning" size="md" className="mt-4">
          Close
        </Button>
      </Link>
    </Container>
  );
};

export default OrderDetailsPage;
