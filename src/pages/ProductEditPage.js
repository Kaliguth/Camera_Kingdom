import React, { useEffect, useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/utility/Loader";
import noImage from "../assets/no-image.png";

const ProductEditPage = () => {
  const { id } = useParams();
  const { getProduct } = useProductContext();
  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      // Fetch the product
      const fetchedProduct = await getProduct(id);
      setProduct(fetchedProduct);
    };

    fetchProductAndRelated();
  }, [id, getProduct]);

  const handleSaveChanges = () => {
    setSaving(true);
    // await updateProduct(id, product);
    setSaving(false);
  };

  if (!product) {
    return <Loader />;
  }

  return (
    <Container className="custom-container">
      <hr className="thick-hr m-5" />
      <Card className="custom-card">
        <Card.Header>
          <h3>
            <u>
              Editting {product.brand} {product.model}
            </u>
          </h3>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSaveChanges}>
            <Form.Label>
              <b>
                <u>Details</u>
              </b>
            </Form.Label>

            <Row className="justify-content-center mb-4">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>Category:</Form.Label>
                  <Form.Select
                    className="form-controls text-center"
                    type="text"
                    name="category"
                    value={product.category}
                    // onChange={handleInputChange}
                  >
                    <option value="cameras">Cameras</option>
                    <option value="lenses">Lenses</option>
                    <option value="accessories">Accessories</option>
                    <option value="bags">Bags</option>
                    <option value="tripods">Tripods</option>
                    <option value="lighting">Lighting</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand:</Form.Label>
                  <Form.Control
                    className="form-controls"
                    type="text"
                    name="brand"
                    value={product.brand}
                    // onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group className="mb-3">
                  <Form.Label>Model:</Form.Label>
                  <Form.Control
                    className="form-controls"
                    type="text"
                    name="model"
                    value={product.model}
                    // onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>Type:</Form.Label>
                  <Form.Control
                    className="form-controls"
                    type="text"
                    name="type"
                    value={product.type}
                    // onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group className="mb-3">
                  <Form.Label>Price:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="number"
                    name="price"
                    value={product.price}
                    onWheel={(e) => e.target.blur()} // Disable value change by mousewheel
                    // onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="number"
                    name="stock"
                    value={product.stock}
                    onWheel={(e) => e.target.blur()} // Disable value change by mousewheel
                    // onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="thick-hr" />
            <Form.Label>
              <b>
                <u>Content</u>
              </b>
            </Form.Label>
            <Row className="justify-content-center mb-5">
              <Col lg={10} md={10} sm={10} xs={10}>
                <Form.Group>
                  <Form.Label>Description:</Form.Label>
                  <Form.Text>
                    <p>(Short product summary)</p>
                  </Form.Text>
                  <Form.Control
                    className="form-controls"
                    as="textarea"
                    rows={3}
                    name="description"
                    value={product.description}
                    // onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col lg={10} md={10} sm={10} xs={10}>
                <Form.Group>
                  <Form.Label className="mb-0">Images:</Form.Label>
                  {product.images.map((image, index) => (
                    <Container
                      key={index}
                      className="d-flex align-items-center mb-2"
                    >
                      <Form.Control
                        className="form-controls"
                        type="url"
                        placeholder="Image URL"
                        value={image}
                        //   onChange={(e) =>
                        //     handleImageChange(index, e.target.value)
                        //   }
                        //   isInvalid={!!imagesError}
                      />
                      <Card.Img
                        variant="top"
                        src={product.images[index]}
                        className="small-product-image ms-2 me-2"
                        onError={(e) => {
                          e.target.src = noImage;
                        }}
                      />

                      {index === 0 && (
                        <Form.Control.Feedback type="invalid">
                        {/* <b>{imagesError}</b>
                        Move above all images in <p>
                        Example: 
                        {(specNameError || specTextError) && (
                        <Container className="text-danger mb-3">
                            {specNameError && (
                                <p>
                                    <b>{specNameError}</b>
                                </p>
                            )}
                            {specTextError && (
                                <p>
                                    <b>{specTextError}</b>
                                </p>
                            )}
                        </Container>
                        )}*/}
                        </Form.Control.Feedback>
                      )}

                      <Button
                        className="h-50 mt-2"
                        variant="danger"
                        size="sm"
                        // onClick={() => handleRemoveImage(index)}
                      >
                        Remove Image
                      </Button>
                    </Container>
                  ))}
                  <Button
                    className="mt-2"
                    variant="success"
                    size="sm"
                    //   onClick={handleAddImage}
                  >
                    Add Image
                  </Button>
                </Form.Group>
              </Col>
            </Row>

            <hr className="thick-hr" />
            <Row className="justify-content-center mb-4">
              <Col lg={10} md={10} sm={10} xs={10}>
                <Form.Group>
                  <Form.Label>
                    <b>
                      <u>Product Overview</u>
                    </b>
                  </Form.Label>
                  <Form.Text>
                    <p>Product highlights, insights, key features etc.</p>
                  </Form.Text>
                  <Form.Text>
                    <p>(This is displayed above all specs)</p>
                  </Form.Text>
                  <Form.Control
                    className="form-controls"
                    as="textarea"
                    rows={5}
                    value={product.specs[0]?.text[0]}
                    // onChange={(e) => handleSpecTextChange(0, 0, e.target.value)}
                    // isInvalid={!!overviewError}
                  />
                  {/* <Form.Control.Feedback type="invalid">
                    <b>{overviewError}</b>
                  </Form.Control.Feedback> */}
                </Form.Group>
              </Col>
            </Row>

            <hr className="thick-hr" />
            <Row className="justify-content-center mb-4">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group controlId="specs" className="mb-3">
                  <Form.Label>Specifications</Form.Label>
                  {product.specs.map((spec, index) => (
                    <Form.Control
                      className="form-controls"
                      key={index}
                      type="text"
                      value={spec.name}
                      //   onChange={(e) => handleSpecsChange(index, e.target.value)}
                    />
                  ))}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" size="lg" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Card.Footer>
      </Card>

      <Link to="/admin-dashboard/products/edit">
        <Button variant="warning" size="md" className="mt-4">
          Close
        </Button>
      </Link>
    </Container>
  );
};

export default ProductEditPage;
