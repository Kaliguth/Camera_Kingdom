import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import {
  Button,
  Card,
  Row,
  Col,
  ListGroup,
  Image,
  Form,
} from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoginToPurchaseAlert from "../alerts/LoginToPurchaseAlert";
import { useProductContext } from "../../contexts/ProductContext";
import userImage from "../../assets/user-nobgnew.png";
import { FaTrash } from "react-icons/fa";

const ProductReviewsCard = ({ product }) => {
  const { addReview, removeReview } = useProductContext();
  const { currentUser, userData } = useAuthContext();
  const [newReview, setNewReview] = useState("");

  // Error texts
  const [reviewError, setReviewError] = useState("");

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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    resetError();

    const reviewToAdd = {
      message: newReview,
      user: userData,
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

  const handleDeleteReview = (reviewIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (confirmDelete) {
      removeReview(product.id, reviewIndex)
        .then(() => {
          alert("Review deleted");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <Card>
      <Row>
        <Col md={11} className="text-start m-3">
          <h4>Customer Reviews</h4>
          <ListGroup variant="flush">
            {product.reviews?.length === 0 ? (
              <p className="mt-2">No reviews submitted</p>
            ) : (
              product.reviews?.map((review, index) => (
                <div key={index}>
                  <ListGroup.Item>
                    <p>"{review.message}"</p>
                    <Image
                      className="me-3"
                      src={review.user.photoURL}
                      alt="Profile picture"
                      roundedCircle
                      width={35}
                      height={35}
                      onError={(e) => {
                        e.target.src = userImage;
                      }}
                    />
                    <small>
                      <b>{review.user.displayName || "Anonymous"}</b>
                    </small>
                    <small className="text-muted ms-3">
                      {new Date(review.date).toLocaleDateString()}
                    </small>
                    {currentUser?.displayName === review.user.displayName && (
                      <FaTrash
                        className="text-danger ms-3"
                        onClick={() => handleDeleteReview(index)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </ListGroup.Item>
                </div>
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
