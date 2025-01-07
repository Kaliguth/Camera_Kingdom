import React, { useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [specTextError, setSpecTextError] = useState("");

  // Method to reset the errors
  // Used every time a create product is clicked
  const resetErrors = () => {
    setBrandError("");
    setModelError("");
    setTypeError("");
    setPriceError("");
    setDescError("");
    setImagesError("");
    setOverviewError("");
    setSpecNameError("");
    setSpecTextError("");
  };

  // Method to set the needed error text
  const updateErrorMessage = (error) => {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes("brand")) {
      setBrandError(error.message);
      window.scrollTo(0, 520);
    } else if (errorMessage.includes("model")) {
      setModelError(error.message);
      window.scrollTo(0, 560);
    } else if (errorMessage.includes("type")) {
      setTypeError(error.message);
      window.scrollTo(0, 600);
    } else if (errorMessage.includes("price")) {
      setPriceError(error.message);
      window.scrollTo(0, 620);
    } else if (errorMessage.includes("description")) {
      setDescError(error.message);
      window.scrollTo(0, 780);
    } else if (errorMessage.includes("image")) {
      setImagesError(error.message);
      window.scrollTo(0, 800);
    } else if (errorMessage.includes("overview")) {
      setOverviewError(error.message);
      window.scrollTo(0, 1160);
    } else if (errorMessage.includes("names")) {
      setSpecNameError(error.message);
      window.scrollTo(0, 1360);
    } else if (errorMessage.includes("details")) {
      setSpecTextError(error.message);
      window.scrollTo(0, 1360);
    } else {
      toast.error(error.message);
    }
  };

  // Aspect change handles
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

  const handleSpecTextChange = (specIndex, textIndex, value) => {
    const updatedSpecs = [...specs];
    updatedSpecs[specIndex].text[textIndex] = value;
    setSpecs(updatedSpecs);
  };

  // Add and remove aspect handles
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
    if (updatedSpecs.length === 1) resetErrors();
    setSpecs(updatedSpecs);
  };

  const handleAddSpecText = (specIndex) => {
    const updatedSpecs = [...specs];
    updatedSpecs[specIndex].text.push("");
    setSpecs(updatedSpecs);
  };

  const handleRemoveSpecText = (specIndex, textIndex) => {
    const updatedSpecs = [...specs];
    updatedSpecs[specIndex].text = updatedSpecs[specIndex].text.filter(
      (_, currentIndex) => currentIndex !== textIndex
    );
    setSpecs(updatedSpecs);
  };

  // Form submit handle
  const handleCreateProduct = (e) => {
    e.preventDefault();
    resetErrors();

    // Filtering images from empty aspects
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
        toast.success(`${newProduct.brand} ${newProduct.model} added successfully`);
        clearFields();
        window.scrollTo(0, 0);
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
                  {images.map((image, index) => (
                    <Container key={index} className="mb-2">
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
                      {index === 0 ? (
                        <Form.Control.Feedback type="invalid">
                          <b>{imagesError}</b>
                        </Form.Control.Feedback>
                      ) : (
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
                    onChange={(e) => handleSpecTextChange(0, 0, e.target.value)}
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
                            {specIndex !== 0 && (
                              <Form.Label>Spec Name:</Form.Label>
                            )}
                            <Col
                              lg={"auto"}
                              md={"auto"}
                              sm={"auto"}
                              xs={"auto"}
                            >
                              <Form.Control
                                className="form-controls"
                                type="text"
                                placeholder={`Spec ${specIndex}`}
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

                          <Form.Label className="mt-2">
                            Spec Details:
                          </Form.Label>
                          <Form.Text>
                            <p>(Each detail will be displayed in a new line)</p>
                          </Form.Text>
                          {spec.text.map((text, textIndex) => (
                            <Row
                              key={textIndex}
                              className="justify-content-center mb-2"
                            >
                              <Col
                                lg={"auto"}
                                md={"auto"}
                                sm={"auto"}
                                xs={"auto"}
                              >
                                <Container key={textIndex} className="mb-2">
                                  <Form.Control
                                    className="form-controls"
                                    type="text"
                                    placeholder={`Detail ${textIndex + 1}`}
                                    value={text}
                                    onChange={(e) =>
                                      handleSpecTextChange(
                                        specIndex,
                                        textIndex,
                                        e.target.value
                                      )
                                    }
                                    isInvalid={
                                      specs[specIndex].text[textIndex] === "" &&
                                      !!specTextError
                                    }
                                  />
                                  {/* {textIndex === 0 ? (
                                    <Form.Control.Feedback type="invalid">
                                      <b>{specTextError}</b>
                                    </Form.Control.Feedback>
                                  ) : ( */}
                                  {
                                    textIndex !== 0 && (
                                      <Button
                                        className="mt-2"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                          handleRemoveSpecText(
                                            specIndex,
                                            textIndex
                                          );
                                        }}
                                      >
                                        Remove Detail
                                      </Button>
                                    )
                                    //   )}
                                  }
                                </Container>
                              </Col>
                            </Row>
                          ))}
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAddSpecText(specIndex)}
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
