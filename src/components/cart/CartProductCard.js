import React from "react";
import { useCartContext } from "../../contexts/CartContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import {
  ListGroup,
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
} from "react-bootstrap";
import InputSpinner from "react-bootstrap-input-spinner";
import { FaTrash } from "react-icons/fa";

const CartProductCard = ({ product }) => {
  const { removeFromCart, handleQuantityChange } = useCartContext();
  const { formatPrice } = useValidationContext();

  return (
    // <Card className="cart-card">
    //   <Card.Body>
    //     <Row>
    //       <Col md={3}>
    //         <Card.Img
    //           variant="small"
    //           src={product.image1}
    //           alt={product.model}
    //           height={100}
    //           className="p-2"
    //         />
    //       </Col>
    //       <Col md={2}>
    //         <p className="small text-muted pb-2">Name</p>
    //         <h6 className="mt-3">
    //           {product.brand} {product.model}
    //         </h6>
    //       </Col>
    //       <Col md={2}>
    //         <p className="small text-muted pb-2">Quantity</p>
    //         <Row className="d-flex justify-content-center">
    //           <Container className="quantity-input-container">
    //             <InputSpinner
    //               type="int"
    //               precision={0}
    //               max={100}
    //               min={1}
    //               step={1}
    //               value={product.quantity}
    //               onChange={(newQuantity) =>
    //                 handleQuantityChange(product.id, newQuantity)
    //               }
    //             />
    //           </Container>
    //           {/* <Button
    //                     variant="light"
    //                     className="cart-quantity-buttons btn-lg"
    //                     onClick={() =>
    //                       handleQuantityChange(product.id, product.quantity - 1)
    //                     }
    //                   >
    //                     -
    //                   </Button>
    //                   <input
    //                     type="number"
    //                     className="text-center w-25"
    //                     value={product.quantity}
    //                     min="1"
    //                     onChange={(e) =>
    //                       handleQuantityChange(
    //                         product.id,
    //                         parseInt(e.target.value, 10 || 1)
    //                       )
    //                     }
    //                   />
    //                   <Button
    //                     variant="light"
    //                     className="cart-quantity-buttons btn-lg"
    //                     onClick={() =>
    //                       handleQuantityChange(product.id, product.quantity + 1)
    //                     }
    //                   >
    //                     +
    //                   </Button>
    //                   <h6 className="mt-2 pt-1">{product.quantity}</h6> */}
    //         </Row>
    //       </Col>
    //       <Col md={2}>
    //         <p className="small text-muted pb-2">Unit price</p>
    //         <h6 className="mt-3 pt-2">₪ {product.price}</h6>
    //       </Col>
    //       <Col md={2}>
    //         <p className="small text-muted pb-2">Total</p>
    //         <h6 className="mt-3 pt-2">₪ {product.price * product.quantity}</h6>
    //       </Col>
    //       <Col md={1} className=" mt-4 pt-3">
    //         <Button variant="link" aria-label="Remove button">
    //           <FaTrash
    //             color="red"
    //             size={22}
    //             onClick={() => removeFromCart(product)}
    //           />
    //         </Button>
    //       </Col>
    //     </Row>
    //   </Card.Body>
    // </Card>
    <ListGroup.Item className="d-flex align-items-center">
      <Row className="cart-card w-100">
        {/* Product Image */}
        <Col xs={3} md={2} className="d-flex align-items-center">
          <Image
            src={product.image1}
            alt={product.model}
            // fluid
            height={80}
            className="p-2"
          />
        </Col>

        {/* Product Name */}
        <Col
          xs={4}
          md={3}
          className="d-flex flex-column justify-content-between"
        >
          <small className="text-muted">Name</small>
          <h6>
            {product.brand} {product.model}
          </h6>
          <span />
        </Col>

        {/* Quantity Input */}
        <Col xs={3} md={2} className="d-flex flex-column align-items-between">
          <small className="text-muted mb-1">Quantity</small>
          <Container className="quantity-input-container">
            <InputSpinner
              type="int"
              precision={0}
              max={100}
              min={1}
              step={1}
              value={product.quantity}
              onChange={(newQuantity) =>
                handleQuantityChange(product.id, newQuantity)
              }
            />
          </Container>
        </Col>

        {/* Unit Price */}
        <Col
          xs={3}
          md={2}
          className="d-flex flex-column justify-content-between"
        >
          <small className="text-muted">Unit Price</small>
          <h6>{formatPrice(product.price)}</h6>
          <span />
        </Col>

        {/* Total Price */}
        <Col
          xs={3}
          md={2}
          className="d-flex flex-column justify-content-between"
        >
          <small className="text-muted">Total</small>
          <h6>{formatPrice(product.price * product.quantity)}</h6>
          <span />
        </Col>

        {/* Remove Button */}
        <Col
          xs={1}
          className="d-flex align-items-center justify-content-center"
        >
          <Button
            variant="link"
            aria-label="Remove product"
            onClick={() => removeFromCart(product)}
          >
            <FaTrash color="red" size={22} />
          </Button>
        </Col>
        <hr />
      </Row>
    </ListGroup.Item>
  );
};

export default CartProductCard;
