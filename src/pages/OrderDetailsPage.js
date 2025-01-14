import React, { useEffect, useRef, useState } from "react";
import { useOrderManagementContext } from "../contexts/OrderManagementContext";
import { Container, Button, Row, Image } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import Loader from "../components/utility/Loader";
import logo from "../assets/logo_small.png";
import OrderDetailsCard from "../components/order/OrderDetailsCard";
import HomeButtons from "../components/utility/HomeButtons";

// Page to show an order's details
const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { getOrder } = useOrderManagementContext();
  const [orderLoading, setOrderLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // Location/path tracks to determine if admin UI should be used
  const location = useLocation();
  const path = useRef(location.pathname);

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

  // Condition to use admin UI (only if user came from admin dashboard)
  const adminUi = path.current.startsWith("/admin-dashboard");

  return (
    <Container className="custom-container">
      {/* Show hr from admins and logo for users */}
      {adminUi ? (
        <hr className="thick-hr m-5 hide-on-print" />
      ) : (
        <Row className="justify-content-center mt-3">
          <Image
            src={logo}
            alt="Logo image"
            style={{ maxWidth: "150px", height: "auto" }}
          />
        </Row>
      )}

      <OrderDetailsCard order={order} />

      {adminUi ? (
        <Link to="/admin-dashboard/orders/view" className="hide-on-print">
          <Button variant="warning" size="md" className="mt-4">
            Close
          </Button>
        </Link>
      ) : (
        <HomeButtons size={"md"} />
      )}
    </Container>
  );
};

export default OrderDetailsPage;
