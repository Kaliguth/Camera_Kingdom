import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { useWishlistContext } from "../../contexts/WishlistContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import {
  Button,
  Card,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { FaStar, FaRegStar } from "react-icons/fa";
import { logoMap } from "../../assets/LogoMap";
import noImage from "../../assets/no-image.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginToPurchaseAlert from "../alerts/LoginToPurchaseAlert";
import ProductImagesSwiper from "../design/ProductImagesSwiper";

const ProductCard = ({ product }) => {
  const { currentUser, userData } = useAuthContext();
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist } = useWishlistContext();
  const { formatPrice, largeSquareLogoStyle } = useValidationContext();
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
        toast.success(`${product.model} added to your cart!`);
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
          `${product.model} added to your cart! moving to checkout page`
        );
        navigate("/checkout");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <Card className="product-card position-relative">
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
      <Link to={`/product/${product.id}`} className="black-link-text mt-3">
        {/* <Card.Img
          variant="top"
          src={product.images[0]}
          className="product-image"
        /> */}
        <ProductImagesSwiper product={product} size={"small"} />

        <Card.Img
          src={logo}
          className="product-brand-logo"
          style={largeSquareLogoStyle(product.brand)}
          onError={(e) => {
            e.target.src = noImage;
          }}
        />
      </Link>

      <Card.Body>
        <div>
          <Card.Title className="mt-2">
            <b>{product.brand}</b> <br /> {product.model}
          </Card.Title>
          <Card.Text className="price-text">
            {formatPrice(product.price)}
          </Card.Text>
        </div>
      </Card.Body>

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
        <Row>
          <Col className="p-1">
            <Button
              variant="primary"
              size="md"
              className="product-buttons"
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock <= 0}
            >
              Add to cart
            </Button>
          </Col>
          <Col className="p-1">
            <Link to={`/product/${product.id}`}>
              <Button variant="primary" size="md" className="product-buttons">
                More details
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="p-1">
            <Button
              variant="success"
              size="lg"
              className="product-buttons w-100 mt-2"
              onClick={handleBuyNow}
              disabled={!product.stock || product.stock <= 0}
            >
              Buy now
            </Button>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default ProductCard;
