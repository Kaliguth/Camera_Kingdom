import React, { useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import noImage from "../assets/no-image.png";

// New product page to create a new product in admin dashboard
const NewProductPage = () => {
  const { addNewProduct } = useProductContext();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("cameras");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([""]);
  const [specs, setSpecs] = useState([
    { name: "Product Overview", text: [""] },
  ]);

  const clearFields = () => {
    setBrand("");
    setModel("");
    setType("");
    setCategory("cameras");
    setDescription("");
    setPrice(0);
    setStock(0);
    setImages([""]);
    setSpecs([{ name: "Product Overview", text: [""] }]);
  };

  // Error texts
  const [brandError, setBrandError] = useState("");
  const [modelError, setModelError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descError, setDescError] = useState("");
  const [imagesError, setImagesError] = useState("");
  const [overviewError, setOverviewError] = useState("");
  const [specNameError, setSpecNameError] = useState("");
  const [specDetailError, setSpecDetailError] = useState("");

  // Method to reset the errors
  // Used every time create product is clicked
  const resetErrors = () => {
    setBrandError("");
    setModelError("");
    setTypeError("");
    setPriceError("");
    setDescError("");
    setImagesError("");
    setOverviewError("");
    setSpecNameError("");
    setSpecDetailError("");
  };

  // Method to set the needed error text
  const updateErrorMessage = (error) => {
    const errorMessage = error.message.toLowerCase();
    let scrollPosition;

    if (errorMessage.includes("brand")) {
      setBrandError(error.message);
      scrollPosition = 520;
    } else if (errorMessage.includes("model")) {
      setModelError(error.message);
      scrollPosition = 560;
    } else if (errorMessage.includes("type")) {
      setTypeError(error.message);
      scrollPosition = 600;
    } else if (errorMessage.includes("price")) {
      setPriceError(error.message);
      scrollPosition = 620;
    } else if (errorMessage.includes("description")) {
      setDescError(error.message);
      scrollPosition = 780;
    } else if (errorMessage.includes("image")) {
      setImagesError(error.message);
      scrollPosition = 800;
    } else if (errorMessage.includes("overview")) {
      setOverviewError(error.message);
      scrollPosition = 1160;
    } else if (errorMessage.includes("names")) {
      setSpecNameError(error.message);
      scrollPosition = 1360;
    } else if (errorMessage.includes("details")) {
      setSpecDetailError(error.message);
      scrollPosition = 1360;
    } else {
      toast.error(error.message);
    }

    // Scroll to error position after a short delay
    if (scrollPosition !== undefined) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      }, 200);
    }
  };

  // Property change handles
  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;

    setImages(updatedImages);
  };

  const handleSpecNameChange = (index, value) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index].name = value;

    setSpecs(updatedSpecs);
  };

  const handleSpecDetailChange = (specIndex, textIndex, value) => {
    const updatedSpecs = [...specs];
    updatedSpecs[specIndex].text[textIndex] = value;

    setSpecs(updatedSpecs);
  };

  // Add and remove property handles
  const handleAddImage = () => setImages([...images, ""]);

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter(
      (_, currentIndex) => currentIndex !== indexToRemove
    );

    setImages(updatedImages);
  };

  const handleAddSpec = () => setSpecs([...specs, { name: "", text: [""] }]);

  const handleRemoveSpec = (indexToRemove) => {
    const updatedSpecs = specs.filter(
      (_, currentIndex) => currentIndex !== indexToRemove
    );

    // Reset spec errors when length reaches 1
    if (updatedSpecs.length === 1) resetErrors();
    setSpecs(updatedSpecs);
  };

  const handleAddSpecDetail = (specIndex) => {
    const updatedSpecs = [...specs];
    updatedSpecs[specIndex].text.push("");

    setSpecs(updatedSpecs);
  };

  const handleRemoveSpecDetail = (specIndex, textIndex) => {
    const updatedSpecs = [...specs];
    updatedSpecs[specIndex].text = updatedSpecs[specIndex].text.filter(
      (_, currentIndex) => currentIndex !== textIndex
    );

    setSpecs(updatedSpecs);
  };

  // Form submit handle (creating new product)
  const handleCreateProduct = (e) => {
    e.preventDefault();
    resetErrors();

    // Filtering images from empty inputs
    const filteredImages = images.filter((image) => image.trim() !== "");
    // Capitalizing brand, model and type
    const capitalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
    const capitalizedModel = model.charAt(0).toUpperCase() + model.slice(1);
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

    const newProduct = {
      category,
      brand: capitalizedBrand,
      model: capitalizedModel,
      type: capitalizedType,
      price: Number(price),
      stock,
      description,
      images: filteredImages,
      specs,
      likes: [],
      reviews: [],
    };

    addNewProduct(newProduct)
      .then(() => {
        toast.success(
          `${newProduct.brand} ${newProduct.model} added successfully`
        );

        clearFields();

        // Scroll to top after a short delay
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      })
      .catch((error) => {
        updateErrorMessage(error);
      });
  };

  return (
    <Container className="custom-container">
      <hr className="thick-hr m-5" />
      <Card className="custom-card">
        <Card.Header>
          <h3>
            <u>New Product</u>
          </h3>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleCreateProduct}>
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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

            <Row className="justify-content-center mb-2">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand:</Form.Label>
                  <Form.Control
                    className="form-controls"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    isInvalid={!!brandError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{brandError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group className="mb-3">
                  <Form.Label>Model:</Form.Label>
                  <Form.Control
                    className="form-controls"
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    isInvalid={!!modelError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{modelError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group>
                  <Form.Label>Type:</Form.Label>
                  <Form.Control
                    className="form-controls"
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    isInvalid={!!typeError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{typeError}</b>
                  </Form.Control.Feedback>
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
                    min={0}
                    value={price}
                    onWheel={(e) => e.target.blur()} // Disable value change by mousewheel
                    onChange={(e) => setPrice(e.target.value)}
                    isInvalid={!!priceError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{priceError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock:</Form.Label>
                  <Form.Control
                    className="form-controls text-center"
                    type="number"
                    min={0}
                    value={stock}
                    onWheel={(e) => e.target.blur()} // Disable value change by mousewheel
                    onChange={(e) => setStock(e.target.value)}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isInvalid={!!descError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{descError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col lg={10} md={10} sm={10} xs={10}>
                <Form.Group>
                  <Form.Label>Images:</Form.Label>
                  <Form.Text>
                    <p className="mb-0">(Square shaped images only)</p>
                  </Form.Text>
                  {imagesError && (
                    <Container className="text-danger">
                      <p className="mb-0">
                        <b>{imagesError}</b>
                      </p>
                    </Container>
                  )}
                  {images.map((image, index) => (
                    <Container
                      key={index}
                      className="d-flex align-items-center mb-2"
                    >
                      <Form.Control
                        className="form-controls"
                        type="url"
                        placeholder="Image URL"
                        value={image}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        isInvalid={!!imagesError}
                      />
                      <Card.Img
                        src={image}
                        className="small-product-image ms-2 me-2"
                        onError={(e) => {
                          e.target.src = noImage;
                        }}
                      />
                      {index !== 0 && (
                        <Button
                          className="mt-2"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remove Image
                        </Button>
                      )}
                    </Container>
                  ))}
                  <Button
                    className="mt-2"
                    variant="success"
                    size="sm"
                    onClick={handleAddImage}
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
                    value={specs[0].text[0]}
                    onChange={(e) =>
                      handleSpecDetailChange(0, 0, e.target.value)
                    }
                    isInvalid={!!overviewError}
                  />
                  <Form.Control.Feedback type="invalid">
                    <b>{overviewError}</b>
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <hr className="thick-hr" />
            <Row className="justify-content-center mb-4">
              <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <b>
                      <u>Specifications</u>
                    </b>
                  </Form.Label>
                  {(specNameError || specDetailError) && (
                    <Container className="text-danger mb-3">
                      {specNameError && (
                        <p>
                          <b>{specNameError}</b>
                        </p>
                      )}
                      {specDetailError && (
                        <p>
                          <b>{specDetailError}</b>
                        </p>
                      )}
                    </Container>
                  )}
                  {/* <Form.Control.Feedback type="invalid">
                    <b>{specNameError}</b>
                  </Form.Control.Feedback> */}
                  {/* <Form.Control.Feedback type="invalid">
                    <b>{specTextError}</b>
                  </Form.Control.Feedback> */}
                  {specs.map((spec, specIndex) => (
                    <Container key={specIndex}>
                      {specIndex !== 0 && (
                        <>
                          <Row className="justify-content-center mb-3">
                            <Form.Label>
                              <u>Spec {specIndex}</u>
                            </Form.Label>
                            <Form.Label>Name:</Form.Label>
                            <Col
                              lg={"auto"}
                              md={"auto"}
                              sm={"auto"}
                              xs={"auto"}
                            >
                              <Form.Control
                                className="form-controls"
                                type="text"
                                value={spec.name}
                                onChange={(e) =>
                                  handleSpecNameChange(
                                    specIndex,
                                    e.target.value
                                  )
                                }
                                isInvalid={
                                  specs[specIndex].name === "" &&
                                  !!specNameError
                                }
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                <b>{specNameError}</b>
                              </Form.Control.Feedback> */}
                              <Button
                                className="mt-2"
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  handleRemoveSpec(specIndex);
                                }}
                              >
                                Remove Spec
                              </Button>
                            </Col>
                          </Row>

                          <Form.Label className="mt-2">Details:</Form.Label>
                          <Form.Text>
                            <p>(Each detail is displayed in a new line)</p>
                          </Form.Text>
                          {spec.text.map((detail, detailIndex) => (
                            <Row
                              key={detailIndex}
                              className="justify-content-center mb-2"
                            >
                              <Col
                                lg={"auto"}
                                md={"auto"}
                                sm={"auto"}
                                xs={"auto"}
                              >
                                <Container key={detailIndex} className="mb-2">
                                  <Form.Control
                                    className="form-controls"
                                    type="text"
                                    placeholder={`Detail ${detailIndex + 1}`}
                                    value={detail}
                                    onChange={(e) =>
                                      handleSpecDetailChange(
                                        specIndex,
                                        detailIndex,
                                        e.target.value
                                      )
                                    }
                                    isInvalid={
                                      specs[specIndex].text[detailIndex] ===
                                        "" && !!specDetailError
                                    }
                                  />
                                  {detailIndex !== 0 && (
                                    <Button
                                      className="mt-2"
                                      variant="danger"
                                      size="sm"
                                      onClick={() => {
                                        handleRemoveSpecDetail(
                                          specIndex,
                                          detailIndex
                                        );
                                      }}
                                    >
                                      Remove Detail
                                    </Button>
                                  )}
                                </Container>
                              </Col>
                            </Row>
                          ))}
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAddSpecDetail(specIndex)}
                          >
                            Add Detail
                          </Button>
                          <hr className="thick-hr" />
                        </>
                      )}
                    </Container>
                  ))}
                </Form.Group>
                <Button variant="success" size="sm" onClick={handleAddSpec}>
                  Add Specification
                </Button>
              </Col>
            </Row>

            <hr className="thick-hr mb-4" />
            <Button variant="primary" size="lg" type="submit">
              Create Product
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Link to="/admin-dashboard/products">
        <Button variant="warning" size="md" className="mt-4">
          Close
        </Button>
      </Link>
    </Container>
  );
};

export default NewProductPage;
