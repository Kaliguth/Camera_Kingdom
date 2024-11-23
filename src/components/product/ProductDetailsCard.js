import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { useProductContext } from "../../contexts/ProductContext";
import { useWishlistContext } from "../../contexts/WishlistContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import {
  Button,
  Card,
  Row,
  Col,
  ListGroup,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaStar, FaRegStar } from "react-icons/fa";
import LoginToLikeAlert from "../alerts/LoginToLikeAlert";
import LoginToPurchaseAlert from "../alerts/LoginToPurchaseAlert";
import ProductImagesSwiper from "../design/ProductImagesSwiper";
import noImage from "../../assets/noImage.png";

const ProductDetailsCard = ({ product }) => {
  const { currentUser, userData } = useAuthContext();
  const { addToCart } = useCartContext();
  const { updateProductLikes } = useProductContext();
  const { addToWishlist, removeFromWishlist } = useWishlistContext();
  const { formatPrice, smallSquareLogoStyle } = useValidationContext();
  const [isHovered, setIsHovered] = useState(false); // Wishlist icon hover state
  const logo = logoMap[product.brand] || null;
  const navigate = useNavigate();

  const isInWishlist = userData?.wishlist?.find(
    (currentProduct) => currentProduct.id === product.id
  );

  const wishlistTooltip = (props) => (
    <Tooltip {...props}>
      {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    </Tooltip>
  );

  const handleAddToWishlist = () => {
    addToWishlist(product)
      .then(() => {
        toast.success(`${product.model} added to your wishlist!`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product)
      .then(() => {
        toast.success(`${product.model} removed from your wishlist!`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleLike = () => {
    if (!currentUser) {
      LoginToLikeAlert()
        .then((isConfirmed) => {
          if (isConfirmed) {
            toast.info("Moving to login page");
            navigate("/login");
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });

      return;
    }

    updateProductLikes(product, currentUser.uid).catch((error) => {
      toast.error(error.message);
    });
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      LoginToPurchaseAlert()
        .then((isConfirmed) => {
          if (isConfirmed) {
            toast.info("Moving to login page");
            navigate("/login");
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });

      return;
    }

    addToCart(product)
      .then(() => {
        toast.success(`${product.model} added to your cart`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      LoginToPurchaseAlert()
        .then((isConfirmed) => {
          if (isConfirmed) {
            toast.info("Moving to login page");
            navigate("/login");
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });

      return;
    }

    addToCart(product)
      .then(() => {
        toast.success(
          `${product.model} added to your cart. moving to checkout page`
        );
        navigate("/checkout");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Card className="product-details-card">
      {currentUser && (
        <>
          {isInWishlist ? (
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 200 }}
              overlay={wishlistTooltip}
            >
              <Button
                variant="link"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="position-absolute top-0 end-0 mt-1"
                onClick={handleRemoveFromWishlist}
              >
                {/* Change icon based on hover state */}
                {isHovered ? (
                  <FaRegStar color="gold" size={30} />
                ) : (
                  <FaStar color="gold" size={30} />
                )}
              </Button>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 200 }}
              overlay={wishlistTooltip}
            >
              <Button
                variant="link"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="position-absolute top-0 end-0 mt-1"
                onClick={handleAddToWishlist}
              >
                {/* Change icon based on hover state */}
                {isHovered ? (
                  <FaStar color="gold" size={30} />
                ) : (
                  <FaRegStar color="gold" size={30} />
                )}
              </Button>
            </OverlayTrigger>
          )}
        </>
      )}
      <Row>
        <Col md={6} className="product-images-container">
          <Card.Img
            src={logo}
            className="small-product-brand-logo position-absolute top-0 start-0 ms-2 mt-2"
            style={smallSquareLogoStyle(product.brand)}
            onError={(e) => {
              e.target.src = noImage;
            }}
          />
          <ProductImagesSwiper product={product} size={"large"} />
          {/* <Image
            className="mt-5"
            src={product.images[0]}
            fluid
            style={{ maxHeight: "300px", width: "auto" }}
          /> */}
        </Col>
        <Col md={6} className="mt-4 pt-2 pe-4">
          <h2>
            <b>
              {product.brand} {product.model}
            </b>
          </h2>
          <Button variant="outline-primary" size="sm" onClick={handleLike}>
            {!product.likes?.includes(currentUser.uid) ? (
              <AiOutlineLike
                size={20}
                className="me-2"
                style={{ marginTop: "-5px" }}
              />
            ) : (
              <AiFillLike
                size={20}
                className="me-2"
                style={{ marginTop: "-5px" }}
              />
            )}
            {!product.likes?.includes(currentUser.uid) ? (
              <>Like</>
            ) : (
              <>Unlike</>
            )}
          </Button>
          <h6 className="d-inline ms-3">{product.likes?.length} likes</h6>

          <hr />
          <ListGroup variant="flush">
            <ListGroup.Item style={{ backgroundColor: "ghostwhite" }}>
              <strong>Brand:</strong> {product.brand}
            </ListGroup.Item>
            <ListGroup.Item style={{ backgroundColor: "ghostwhite" }}>
              <strong>Model:</strong> {product.model}
            </ListGroup.Item>
            <ListGroup.Item style={{ backgroundColor: "ghostwhite" }}>
              <strong>Type:</strong> {product.type}
            </ListGroup.Item>
          </ListGroup>
          <hr />

          <h5>
            <b>About this product:</b>
          </h5>
          <small>{product.description}</small>
          <hr />

          <div className="mt-2">
            {!product.stock || product.stock <= 0 ? (
              <div className="out-of-stock-container">
                <span>OUT OF STOCK</span>
              </div>
            ) : product.stock < 50 ? (
              <div className="low-stock-container">
                <span>ONLY {product.stock} LEFT IN STOCK!</span>
              </div>
            ) : null}
          </div>
          <div className="mb-3">
            <h3 className="d-inline me-4">{formatPrice(product.price)}</h3>
            <Button
              variant="success"
              size="lg"
              className="me-2"
              onClick={handleBuyNow}
              disabled={!product.stock || product.stock <= 0}
            >
              Buy now
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="me-2"
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock <= 0}
            >
              Add to cart
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={
                isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist
              }
            >
              {isInWishlist ? "Remove from wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetailsCard;
