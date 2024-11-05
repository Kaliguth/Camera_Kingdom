import React from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { useValidationContext } from "../../contexts/ValidationContext";
import { Button, Card, Row, Col, ListGroup, Image } from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoginToPurchaseAlert from "../alerts/LoginToPurchaseAlert";

const ProductInfoCard = ({ product }) => {
  const logo = logoMap[product.brand] || null;
  const navigate = useNavigate();
  const productSpecs = product.specs || [];

  return (
    <Card>
      <Row className="text-center m-3">
        <h6>
          <u>{productSpecs[0]?.name}</u>
        </h6>
        {productSpecs[0]?.text.map((text) => {
          return <p>{text}</p>;
        })}
        <hr />
      </Row>

      <Row className="text-start m-3">
        <Col>
          {productSpecs?.map((spec, index) => {
            if (index !== 0) {
              if (index < productSpecs.length / 2) {
                return (
                  <Row key={spec.name}>
                    <h6>
                      <u>{spec.name}</u>
                    </h6>
                    {spec?.text.map((text, index) => {
                      return text === "break" ? (
                        <br key={index} />
                      ) : (
                        <p key={index}>{text}</p>
                      );
                    })}
                    <hr />
                  </Row>
                );
              }
            }
          })}
        </Col>

        <Col xs="auto" sm="auto" md="auto" lg="auto" className="d-flex justify-content-center">
          <span
            style={{
              borderLeft: "2px solid #ccc",
            }}
          ></span>
        </Col>

        <Col>
          {productSpecs?.map((spec, index) => {
            if (index !== 0) {
              if (index >= productSpecs.length / 2) {
                return (
                  <Row key={spec.name}>
                    <h6>
                      <u>{spec.name}</u>
                    </h6>
                    {spec?.text.map((text, index) => {
                      return text === "break" ? (
                        <br key={index} />
                      ) : (
                        <p key={index}>{text}</p>
                      );
                    })}
                    <hr />
                  </Row>
                );
              }
            }
          })}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductInfoCard;
