import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { sendEmailVerification } from "firebase/auth";

const LoginRegisterPage = () => {
  const { login, googleLogin, register, logout } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Error texts
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const navigate = useNavigate();

  // Method to reset the errors
  // Used every time a form is submitted and when changing between login and register
  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setNameError("");
  };

  // Method to clear input fields
  // Used when changing between login and register
  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  // Method to set the needed error text
  //                                       CURRENTLY SHOWING ONE ERROR AT A TIME
  //                                              TRY TO SHOW ALL ERRORS
  const updateErrorMessage = (error) => {
    if (error.message.includes("name")) {
      setNameError(error.message);
    } else if (error.message.includes("email")) {
      setEmailError(error.message);
    } else if (error.message.includes("Password")) {
      setPasswordError(error.message);
    } else {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();

    if (isLogin) {
      // Login
      // await login(email, password);
      login(email, password)
        .then((user) => {
          if (user.emailVerified) {
            alert("Logged in successfully!");
            navigate("/");
          } else {
            alert("Email verification needed. Email sent");
            sendEmailVerification(user);
            logout();
            navigate("/login");
          }
        })
        .catch((error) => {
          updateErrorMessage(error);
        });
    } else {
      // Register
      // await register(name, email, password);
      register(name, email, password)
        .then((user) => {
          alert(
            "Registered successfully!\nVerification email sent. Please verify your email"
          );
          sendEmailVerification(user);
          logout();
          navigate("/login");
        })
        .catch((error) => {
          updateErrorMessage(error);
        });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleLogin();
      alert("Signed in with Google");
      navigate("/");
    } catch (error) {
      alert("Failed to sign in with google", error.message);
    }
  };

  // return (
  //   <Container className="mt-4">
  //     <Row className="justify-content-center">
  //       <Col md={6}>
  //         <h2 className="mb-4 text-center">{isLogin ? "Login" : "Register"}</h2>
  //         <Form onSubmit={handleSubmit}>
  //           {!isLogin && (
  //             <Form.Group className="mb-3" controlId="formBasicName">
  //               <Form.Label>Name</Form.Label>
  //               <Form.Control
  //                 type="text"
  //                 placeholder="Enter your name"
  //                 value={name}
  //                 onChange={(e) => setName(e.target.value)}
  //               />
  //             </Form.Group>
  //           )}
  //           <Form.Group className="mb-3" controlId="formBasicEmail">
  //             <Form.Label>Email address</Form.Label>
  //             <Form.Control
  //               type="email"
  //               placeholder="Enter email"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //             />
  //           </Form.Group>
  //           <Form.Group className="mb-4" controlId="formBasicPassword">
  //             <Form.Label>Password</Form.Label>
  //             <Form.Control
  //               type="password"
  //               placeholder="Password"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //             />
  //           </Form.Group>
  //           <div className="d-grid">
  //             <Button variant="primary" type="submit">
  //               {isLogin ? "Login" : "Register"}
  //             </Button>
  //           </div>
  //         </Form>
  //         <div className="d-grid mt-3">
  //           <Button
  //             className="google-signin-btn"
  //             onClick={handleGoogleSignIn}
  //             variant="outline-dark"
  //           >
  //             Sign in with Google
  //           </Button>
  //         </div>
  //         <div className="text-center mt-4">
  //           <Button
  //             variant="link"
  //             onClick={() => setIsLogin(!isLogin)}
  //           >
  //             {isLogin ? (
  //               <b>Need an account?<br />Click here to register!</b>
  //             ) : (
  //               <b>Already have an account?<br />Click here to login!</b>
  //             )}
  //           </Button>
  //         </div>
  //       </Col>
  //     </Row>
  //   </Container>
  // );

  // Todo: Delete user
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2 className="mb-4">{isLogin ? "Login" : "Register"}</h2>
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  className="form-controls"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!nameError}
                />
                <Form.Control.Feedback type="invalid">
                  {nameError}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                className="form-controls"
                type="email"
                placeholder="Enter an email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="form-controls"
                type="password"
                placeholder="Enter a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!passwordError}
              />
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              {isLogin ? "Login" : "Register"}
            </Button>
          </Form>
          <Button
            className="google-signin-btn mt-3"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>
        </Col>
        <Button
          variant="link"
          onClick={() => {
            clearFields();
            resetErrors();
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? (
            <b>
              Need an account?
              <br />
              Click here to register!
            </b>
          ) : (
            <b>
              Already have an account?
              <br />
              Click here to login!
            </b>
          )}
        </Button>
      </Row>
    </Container>
  );
};

export default LoginRegisterPage;
