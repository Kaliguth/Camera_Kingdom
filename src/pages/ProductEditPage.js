import React, { useEffect, useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/utility/Loader";
import noImage from "../assets/no-image.png";
import EditProductAlert from "../components/alerts/EditProductAlert";

const ProductEditPage = () => {
  const { productId } = useParams();
  const { getProduct, updateProductProperties } = useProductContext();
  const [product, setProduct] = useState(null);

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
  // Used every time save changes is clicked
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

  // useEffect to fetch the product to edit by id in params
  useEffect(() => {
    const fetchProduct = async () => {
      // Fetch the product
      const fetchedProduct = await getProduct(productId);
      setProduct(fetchedProduct);
    };

    fetchProduct();
  }, [productId, getProduct]);

  // Property change handles
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (index, newImage) => {
    setProduct((prevProduct) => {
      const updatedImages = [...prevProduct.images];
      updatedImages[index] = newImage;

      return {
        ...prevProduct,
        images: updatedImages,
      };
    });
  };

  const handleSpecNameChange = (specIndex, newName) => {
    setProduct((prevProduct) => {
      const updatedSpecs = [...prevProduct.specs];
      updatedSpecs[specIndex].name = newName;

      return {
        ...prevProduct,
        specs: updatedSpecs,
      };
    });
  };

  const handleSpecDetailChange = (specIndex, detailIndex, newDetail) => {
    setProduct((prevProduct) => {
      const updatedSpecs = [...prevProduct.specs];
      updatedSpecs[specIndex].text[detailIndex] = newDetail;

      return {
        ...prevProduct,
        specs: updatedSpecs,
      };
    });
  };

  // Add and remove Property handles
  const handleAddImage = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ""],
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setProduct((prevProduct) => {
      const updatedImages = prevProduct.images.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prevProduct,
        images: updatedImages,
      };
    });
  };

  const handleAddSpec = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      specs: [...prevProduct.specs, { name: "", text: [""] }],
    }));
  };

  const handleRemoveSpec = (specIndex) => {
    setProduct((prevProduct) => {
      const updatedSpecs = prevProduct.specs.filter(
        (_, index) => index !== specIndex
      );

      // Reset spec errors when length reaches 1
      if (updatedSpecs.length === 1) resetErrors();
      return {
        ...prevProduct,
        specs: updatedSpecs,
      };
    });
  };

  const handleAddSpecDetail = (specIndex) => {
    setProduct((prevProduct) => {
      const updatedSpecs = [...prevProduct.specs];
      updatedSpecs[specIndex].text.push("");

      return {
        ...prevProduct,
        specs: updatedSpecs,
      };
    });
  };

  const handleRemoveSpecDetail = (specIndex, detailIndex) => {
    setProduct((prevProduct) => {
      const updatedSpecs = [...prevProduct.specs];
      updatedSpecs[specIndex].text = updatedSpecs[specIndex].text.filter(
        (_, index) => index !== detailIndex
      );

      return {
        ...prevProduct,
        specs: updatedSpecs,
      };
    });
  };

  // Form submit handle (updating the product)
  const handleSaveChanges = (e) => {
    e.preventDefault();
    resetErrors();

    // Filtering images from empty inputs
    const filteredImages = product.images.filter(
      (image) => image.trim() !== ""
    );
    // Capitalizing brand, model and type
    const capitalizedBrand =
      product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
    const capitalizedModel =
      product.model.charAt(0).toUpperCase() + product.model.slice(1);
    const capitalizedType =
      product.type.charAt(0).toUpperCase() + product.type.slice(1);

    // Converting price to a number
    const convertedPrice = Number(product.price);

    // Temporary updated product object
    const updatedProduct = {
      ...product,
      images: filteredImages,
      brand: capitalizedBrand,
      model: capitalizedModel,
      type: capitalizedType,
      price: convertedPrice,
    };

    EditProductAlert(product.model)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return updateProductProperties(updatedProduct);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success(`Changes to ${product.model} saved successfully`);

        // Update the product state only after update is complete
        setProduct(updatedProduct);
        
        // Scroll to top after a short delay
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Product edit canceled by the user");
        } else {
          updateErrorMessage(error);
        }
      });
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
          <Link to={`/product/${product.id}`}>
            <Button
              className="mt-1 mb-3"
              variant="primary"
              size="md"
              type="submit"
            >
              Review Product's Page
            </Button>
          </Link>

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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    name="model"
                    value={product.model}
                    onChange={handleInputChange}
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
                    name="type"
                    value={product.type}
                    onChange={handleInputChange}
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
                    name="price"
                    min={0}
                    value={product.price}
                    onWheel={(e) => e.target.blur()} // Disable value change by mousewheel
                    onChange={handleInputChange}
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
                    name="stock"
                    min={0}
                    value={product.stock}
                    onWheel={(e) => e.target.blur()} // Disable value change by mousewheel
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        isInvalid={!!imagesError}
                      />
                      <Card.Img
                        src={product.images[index]}
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
                    value={product.specs[0]?.text[0]}
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
                  {product.specs.map((spec, specIndex) => (
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
                                  product.specs[specIndex].name === "" &&
                                  !!specNameError
                                }
                              />
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
                                      product.specs[specIndex].text[
                                        detailIndex
                                      ] === "" && !!specDetailError
                                    }
                                  />
                                  {
                                    detailIndex !== 0 && (
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
              Save Changes
            </Button>
          </Form>
        </Card.Body>
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
