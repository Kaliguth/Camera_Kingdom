import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useMessagesManagementContext } from "../contexts/MessagesManagementContext";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/utility/Loader";
import HomeButtons from "../components/utility/HomeButtons";

// Contact us page
const ContactUsPage = () => {
  const { initialSubject } = useParams();
  const { userLoading, currentUser, userData } = useAuthContext();
  const { addMessage } = useMessagesManagementContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Method to clear all fields
  const clearFields = () => {
    setName(currentUser ? userData.displayName : "");
    setEmail(currentUser ? userData.email : "");
    setSubject("");
    setMessage("");
  };

  // Error texts
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [messageError, setMessageError] = useState("");

  // Method to reset the errors
  // Used every time create product is clicked
  const resetErrors = () => {
    setNameError("");
    setEmailError("");
    setSubjectError("");
    setMessageError("");
  };

  // Method to set the needed error text
  const updateErrorMessage = (error) => {
    const errorMessage = error.message.toLowerCase();
    let scrollPosition;

    if (errorMessage.includes("name")) {
      setNameError(error.message);
      scrollPosition = 100;
    } else if (errorMessage.includes("email")) {
      setEmailError(error.message);
      scrollPosition = 160;
    } else if (errorMessage.includes("subject")) {
      setSubjectError(error.message);
      scrollPosition = 220;
    } else if (errorMessage.includes("message")) {
      setMessageError(error.message);
      scrollPosition = 350;
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

  // useEffect to set the subject if order ID is given in params
  // Also automatically updates name and email if a user is logged in
  useEffect(() => {
    if (initialSubject && initialSubject !== "none") {
      setSubject(`Regarding order ${initialSubject}`);
    }

    if (currentUser) {
      setName(userData.displayName);
      setEmail(userData.email);
    }
  }, [initialSubject, currentUser, userData?.displayName, userData?.email]);

  // Send message handle
  const handleSendMessage = (e) => {
    e.preventDefault();
    resetErrors();

    // Current date and time string
    const now = new Date();
    const currentDateTimeString = `${now.toDateString()} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    // New message object
    const newMessage = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      date: currentDateTimeString,
      seenBy: [],
      answered: false,
    };

    // Send the message
    addMessage(newMessage)
      .then(() => {
        toast.success(
          "The message has been sent. Our team will contact you as soon as possible!"
        );

        // Reset all fields
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

  if (userLoading) {
    return <Loader />;
  }

  return (
    <Container className="custom-container mt-4">
      <Row className="justify-content-center">
        <Col lg={8} md={8} sm={8} xs={8}>
          <h2 className="mb-4">Contact Us</h2>
          <Form onSubmit={handleSendMessage}>
            <Form.Group className="mb-3">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                className="form-controls"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!nameError}
              />
              <Form.Control.Feedback type="invalid">
                <b>{nameError}</b>
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address:</Form.Label>
              <Form.Control
                className="form-controls"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">
                <b>{emailError}</b>
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subject:</Form.Label>
              <Form.Control
                className="form-controls"
                type="text"
                placeholder="Enter the subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                isInvalid={!!subjectError}
              />
              <Form.Control.Feedback type="invalid">
                <b>{subjectError}</b>
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message:</Form.Label>
              <Form.Control
                className="form-controls"
                as="textarea"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                isInvalid={!!messageError}
              />
              <Form.Control.Feedback type="invalid">
                <b>{messageError}</b>
              </Form.Control.Feedback>
            </Form.Group>

            <Button className="custom-button" variant="warning" type="submit">
              Send
            </Button>
          </Form>
        </Col>
      </Row>

      <HomeButtons size={"md"} />
    </Container>
  );
};

export default ContactUsPage;
