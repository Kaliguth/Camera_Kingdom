import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebase";
// import { getOrders } from '../services/OrderService';

const OrdersPage = () => {
//   const [user] = useAuthState(auth);
  const [orders, setOrders] = useState([]);

  //   useEffect(() => {
  //     const fetchOrders = async () => {
  //       if (user) {
  //         const orders = await getOrders(user.uid);
  //         setOrders(orders);
  //       }
  //     };
  //     fetchOrders();
  //   }, [user]);

  //   if (!user) {
  //     return (
  //       <Container>
  //         <Row>
  //           <Col>
  //             <p>Please log in to view your orders.</p>
  //           </Col>
  //         </Row>
  //       </Container>
  //     );
  //   }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't completed any orders yet</p>
      ) : (
        <Row>
          {/* {orders.map((order) => (
            <Col key={order.id} md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Order {order.id}</Card.Title>
                  <Card.Text>
                    Date: {new Date(order.date).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>Total: ${order.total}</Card.Text>
                  <Card.Text>Status: {order.status}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))} */}
        </Row>
      )}
    </Container>
  );
};

export default OrdersPage;
