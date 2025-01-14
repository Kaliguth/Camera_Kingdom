import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useProductContext } from "../../contexts/ProductContext";
import {
  Button,
  Card,
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import RemoveReviewAlert from "../alerts/RemoveReviewAlert";
import userImage from "../../assets/user-nobgnew.png";

// Card where product reviews are displayed
const ProductReviewsCard = ({ product }) => {
  const { addReview, removeReview } = useProductContext();
  const { currentUser, userData, getUserByUid } = useAuthContext();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  // Error texts
  const [reviewError, setReviewError] = useState("");

  // Method to reset the error
  const resetError = () => {
    setReviewError("");
  };

  // Method to set the error text
  const updateErrorMessage = (error) => {
    const errorMessage = error.message.toLowerCase();
    if (!errorMessage.includes("failed")) {
      setReviewError(error.message);
    } else {
      toast.error(error.message);
    }
  };

  // useEffect to fetch reviews and add user data to each one (as promise all to ensure asynchronization)
  useEffect(() => {
    if (product.reviews && product.reviews.length > 0) {
      // Go over all reviews and get each review's user data by saved uid
      Promise.all(
        product.reviews.map((review, index) =>
          getUserByUid(review.userId)
            .then((userData) => ({
              ...review,
              userData,
            }))
            .catch((error) => {
              // Logging which review index failed to fetch user data
              console.log(
                `Error fetching user data for review ${index + 1}: `,
                error
              );

              // Failsafe user data on error (getUserByUid error is logged in console)
              return {
                ...review,
                userData: { displayName: "Anonymous", photoURL: userImage },
              };
            })
        )
      )
        .then((updatedReviews) => {
          // Set reviews state with the updated reviews (that now include user data)
          setReviews(updatedReviews);
        })
        .catch((error) => {
          console.log("Error fetching user data for reviews: ", error);
        });
    } else {
      // If no reviews exist
      setReviews([]);
    }
  }, [product.reviews, getUserByUid]);

  // Remove review handle
  const handleRemoveReview = (review, reviewIndex) => {
    RemoveReviewAlert(review, userData)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return removeReview(product.id, reviewIndex);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success("Review removed");
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Review deletion canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  // Review submittion handle
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    resetError();

    const reviewToAdd = {
      message: newReview,
      userId: currentUser.uid,
      date: new Date().toDateString(),
    };

    addReview(product.id, reviewToAdd)
      .then(() => {
        setNewReview("");
        toast.success("Review added successfully!");
      })
      .catch((error) => {
        updateErrorMessage(error);
      });
  };

  return (
    <Card className="product-details-card">
      <Row>
        <Col md={11} className="text-start m-3">
          <h4>Customer Reviews</h4>
          <ListGroup variant="flush">
            {reviews?.length === 0 ? (
              <p className="mt-2">No reviews submitted</p>
            ) : (
              reviews?.map((review, index) => (
                <Container className="custom-container" key={index}>
                  <ListGroup.Item>
                    <p>"{review.message}"</p>
                    <Image
                      className="me-3"
                      src={review.userData.photoURL || userImage}
                      alt={`${review.userData.displayName}'s Profile picture`}
                      roundedCircle
                      width={35}
                      height={35}
                      onError={(e) => {
                        e.target.src = userImage;
                      }}
                    />
                    <small>
                      <b>{review.userData.displayName || "Anonymous"}</b>
                    </small>
                    <small className="text-muted ms-3">
                      {new Date(review.date).toLocaleDateString()}
                    </small>
                    {(userData?.displayName === review.userData.displayName ||
                      userData?.isAdmin) && (
                      <FaTrash
                        className="text-danger ms-3"
                        onClick={() => handleRemoveReview(review, index)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </ListGroup.Item>
                </Container>
              ))
            )}
          </ListGroup>

          {currentUser ? (
            <Form onSubmit={handleReviewSubmit} className="mt-2">
              <Form.Group controlId="reviewInput">
                <Form.Label>Write a review:</Form.Label>
                <Form.Control
                  className="form-controls"
                  as="textarea"
                  rows={5}
                  placeholder="Write your review here"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  isInvalid={!!reviewError}
                />
                <Form.Control.Feedback type="invalid">
                  <b>{reviewError}</b>
                </Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="primary" className="mt-3">
                Submit Review
              </Button>
            </Form>
          ) : (
            <Row className="mt-3 ms-2">
              <Col
                xs={"auto"}
                sm={"auto"}
                md={"auto"}
                lg={"auto"}
                className="mt-1"
              >
                <h6>Log in to write a review</h6>
              </Col>
              <Col xs={"auto"} sm={"auto"} md={"auto"} lg={"auto"}>
                <Link to={`/login`}>
                  <Button variant="primary" size="sm">
                    Log in
                  </Button>
                </Link>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductReviewsCard;
