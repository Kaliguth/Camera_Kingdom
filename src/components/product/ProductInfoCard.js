import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";

const ProductInfoCard = ({ product }) => {
  const logo = logoMap[product.brand] || null;
  const productSpecs = product.specs || [];

  return (
    <Card>
      <Row className="text-center m-3">
        <h6>
          <u>{productSpecs[0]?.name}</u>
        </h6>
        {productSpecs[0]?.text.map((text, index) => {
          return <p key={index}>{text}</p>;
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
                      return <p key={index}>{text}</p>;
                    })}
                    {index !== productSpecs.length / 2 - 1 && <hr />}
                  </Row>
                );
              }
            }
          })}
        </Col>

        <Col
          xs="auto"
          sm="auto"
          md="auto"
          lg="auto"
          className="d-flex justify-content-center"
        >
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
                        <p key={index} />
                      ) : (
                        <p key={index}>{text}</p>
                      );
                    })}
                    {index !== productSpecs.length - 1 && <hr />}
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
