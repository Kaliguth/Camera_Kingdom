// src/pages/Wishlist.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../firebase';
// import { getWishlist, removeFromWishlist } from '../services/WishlistService';
// import { getProducts } from '../services/ProductService';
import { useAuthContext } from "../contexts/AuthContext";

const WishlistPage = () => {
    const { currentUser } = useAuthContext();
  //   const [user] = useAuthState(auth);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (user) {
//         const wishlist = await getWishlist(user.uid);
//         const productIds = wishlist.map((item) => item.productId);
//         const products = await getProducts();
//         const filteredProducts = products.filter((product) =>
//           productIds.includes(product.id)
//         );
//         setWishlist(wishlist);
//         setProducts(filteredProducts);
//       }
//     };
//     fetchWishlist();
//   }, [user]);

//   const handleRemoveFromWishlist = async (wishlistId) => {
//     await removeFromWishlist(wishlistId);
//     const updatedWishlist = wishlist.filter((item) => item.id !== wishlistId);
//     setWishlist(updatedWishlist);
//   };

  if (!currentUser) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <p>Please log in to view your wishlist.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Your Wishlist</h2>
      {products.length === 0 ? (
        <p>You haven't saved any products yet</p>
      ) : (
        <Row>
          {/* {products.map((product) => (
            <Col key={product.id} md={4}>
              <Card>
                <Card.Img variant="top" src={product.image} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Card.Text>${product.price}</Card.Text>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleRemoveFromWishlist(
                        wishlist.find((item) => item.productId === product.id)
                          .id
                      )
                    }
                  >
                    Remove from Wishlist
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))} */}
        </Row>
      )}
    </Container>
  );
};

export default WishlistPage;
