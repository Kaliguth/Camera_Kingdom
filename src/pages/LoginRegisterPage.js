import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../components/utility/Loader";
import HomeButtons from "../components/utility/HomeButtons";

const LoginRegisterPage = () => {
  const { userLoading, currentUser, login, googleLogin, register, logout } =
    useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Error texts
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  // Paswword visability
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Functions to toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleRepeatPasswordVisibility = () =>
    setShowRepeatPassword((prev) => !prev);

  // Method to reset the errors
  // Used every time a form is submitted and when changing between login and register
  const resetErrors = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setRepeatPasswordError("");
  };

  // Method to clear input fields
  // Used when changing between login and register
  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
  };

  // Method to set the needed error text
  const updateErrorMessage = (error) => {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes("verification")) {
      toast.info(error.message);
    } else if (errorMessage.includes("name")) {
      setNameError(error.message);
    } else if (errorMessage.includes("email")) {
      setEmailError(error.message);
    } else if (errorMessage.includes("password")) {
      setPasswordError(error.message);
    } else if (
      errorMessage.includes("repeat") ||
      errorMessage.includes("match")
    ) {
      setRepeatPasswordError(error.message);
    } else {
      toast.error(error.message);
    }
  };

  const showPasswordTooltip = (props) => (
    <Tooltip {...props}>
      {showPassword ? "Hide password" : "Show password"}
    </Tooltip>
  );

  const showRepeatPasswordTooltip = (props) => (
    <Tooltip {...props}>
      {showRepeatPassword ? "Hide password" : "Show password"}
    </Tooltip>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    resetErrors();

    if (isLogin) {
      // Login
      login(email, password)
        .then((userCredentials) => {
          toast(`Welcome ${userCredentials.user.displayName}!`);
          navigate("/");
        })
        .catch((error) => {
          updateErrorMessage(error);
        });
    } else {
      // Register
      register(name, email, password, repeatPassword)
        .then((userCredentials) => {
          logout()
            .then(() => {
              clearFields();
              setIsLogin(true);
            })
            .catch((error) => {
              clearFields();
              toast.error(error.message);
            });
          const user = userCredentials.user;
          toast.success(
            `Registered successfully!\nVerification email sent to ${email}. Please verify your email address`
          );
          sendEmailVerification(user);
        })
        .catch((error) => {
          updateErrorMessage(error);
        });
    }
  };

  const handleGoogleSignIn = () => {
    googleLogin()
      .then((userCredentials) => {
        toast(`Welcome ${userCredentials.user.displayName}!`);
        navigate("/");
      })
      .catch((error) => {
        toast.error("Failed to sign in with google");
        console.log("Error while signing in with google: ", error);
      });
  };

  if (userLoading) {
    return <Loader />;
  }

  if (currentUser) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <h5>
              <b>
                {currentUser.displayName ? currentUser.displayName : "A user"}
              </b>{" "}
              is already logged in
            </h5>
            <HomeButtons size={"lg"} />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="custom-container mt-4">
      <Row className="justify-content-center">
        <Col lg={"auto"} md={"auto"} sm={"auto"} xs={"auto"}>
          <h2 className="mb-4">{isLogin ? "Login" : "Register"}</h2>
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-3">
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
                  <b>{nameError}</b>
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
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
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Container className="password-container">
                <Form.Control
                  className="form-controls"
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Enter a password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!passwordError}
                />
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 200 }}
                  overlay={showPasswordTooltip}
                >
                  <Button
                    variant="none"
                    onClick={togglePasswordVisibility}
                    className="show-hide-button"
                  >
                    {showPassword ? (
                      <FaRegEyeSlash color="dimgray" />
                    ) : (
                      <FaRegEye color="dimgray" />
                    )}
                  </Button>
                </OverlayTrigger>
              </Container>
              <Form.Control.Feedback
                type="invalid"
                style={{ display: "block" }}
              >
                <b>{passwordError}</b>
              </Form.Control.Feedback>
            </Form.Group>
            {!isLogin && (
              <Form.Group className="mb-4">
                <Form.Label>Repeat password</Form.Label>
                <Container className="password-container">
                  <Form.Control
                    className="form-controls"
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="Repeat the password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    isInvalid={!!repeatPasswordError}
                  />
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 200 }}
                    overlay={showRepeatPasswordTooltip}
                  >
                    <Button
                      variant="none"
                      onClick={toggleRepeatPasswordVisibility}
                      className="show-hide-button"
                    >
                      {showRepeatPassword ? (
                        <FaRegEyeSlash color="dimgray" />
                      ) : (
                        <FaRegEye color="dimgray" />
                      )}
                    </Button>
                  </OverlayTrigger>
                </Container>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: "block" }}
                >
                  <b>{repeatPasswordError}</b>
                </Form.Control.Feedback>
              </Form.Group>
            )}
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
