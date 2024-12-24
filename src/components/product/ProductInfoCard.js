import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const ProductInfoCard = ({ product }) => {
  const productSpecs = product.specs || [];

  return (
    <Card>
      <Row className="text-center m-3">
        <h6>
          <u>
            <b>{productSpecs[0]?.name}</b>
          </u>
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
                      <u>
                        <b>{spec.name}</b>
                      </u>
                    </h6>
                    {spec?.text.map((text, index) => {
                      return <p key={index}>{text}</p>;
                    })}
                    {index !== productSpecs.length / 2 - 1 && <hr />}
                  </Row>
                );
              }
            }

            return null;
          })}
        </Col>

        <Col
          xs="auto"
          sm="auto"
          md="auto"
          lg="auto"
          className="d-flex justify-content-center"
        >
          <span className="custom-divider" />
        </Col>

        <Col>
          {productSpecs?.map((spec, index) => {
            if (index !== 0) {
              if (index >= productSpecs.length / 2) {
                return (
                  <Row key={spec.name}>
                    <h6>
                      <u>
                        <b>{spec.name}</b>
                      </u>
                    </h6>
                    {spec?.text.map((text, index) => {
                      return <p key={index}>{text}</p>;
                    })}
                    {index !== productSpecs.length - 1 && <hr />}
                  </Row>
                );
              }
            }

            return null;
          })}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductInfoCard;
