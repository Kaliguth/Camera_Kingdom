import React, { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useUserManagementContext } from "../contexts/UserManagementContext";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../components/utility/Loader";
import UpdateProfileAlert from "../components/alerts/UpdateProfileAlert";
import ChangePasswordAlert from "../components/alerts/ChangePasswordAlert";
import Error404 from "../assets/Error404.png";
import userImage from "../assets/user-nobgnew.png";
import HomeButtons from "../components/utility/HomeButtons";

// Profile page to show user details and update it
const ProfilePage = () => {
  const { userLoading, currentUser, userData } = useAuthContext();
  const { updateUserProfile, changeUserPassword } = useUserManagementContext();
  const [displayName, setDisplayName] = useState(userData.displayName);
  const [photoURL, setPhotoURL] = useState(userData.photoURL);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Clear password fields method
  const clearPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
  };

  // Error texts
  const [nameError, setnameError] = useState("");
  const [currentPassError, setCurrentPassError] = useState("");
  const [newPassError, setNewPassError] = useState("");

  // Method to reset the errors
  // Used each time update profile and change password are clicked
  const resetErrors = () => {
    setnameError("");
    setCurrentPassError("");
    setNewPassError("");
  };

  // Method to set the needed error text
  const updateErrorMessage = (error) => {
    const errorMessage = error.message.toLowerCase();
    let scrollPosition;

    if (errorMessage.includes("display name")) {
      setnameError(error.message);
      scrollPosition = 500;
    } else if (errorMessage.includes("current password")) {
      setCurrentPassError(error.message);
      scrollPosition = 850;
    } else if (errorMessage.includes("new password")) {
      setNewPassError(error.message);
      scrollPosition = 850;
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

  // Update profile handle (display name and photoURL)
  const handleUpdateUserProfile = (e) => {
    e.preventDefault();
    resetErrors();

    // Creating a new user object with id field holding currentUser's uid
    // This is because updateUserProfile is using id and not uid
    // (Preparation for profile updates on users that are not currentUser)
    const userWithId = {
      ...currentUser,
      id: currentUser.uid,
    };

    UpdateProfileAlert()
      .then((isConfirmed) => {
        if (isConfirmed) {
          return updateUserProfile(userWithId, photoURL, displayName);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success("Your profile has been updated successfully");
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Profile update canceled by the user");
        } else {
          updateErrorMessage(error);
        }
      });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    resetErrors();

    // Creating a new user object with id field holding currentUser's uid
    const userWithId = {
      ...currentUser,
      id: currentUser.uid,
    };

    ChangePasswordAlert()
      .then((isConfirmed) => {
        if (isConfirmed) {
          return changeUserPassword(userWithId, currentPassword, newPassword);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success("Your password has been updated successfully");

        clearPasswordFields();
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Password change canceled by the user");
        } else {
          updateErrorMessage(error);
        }
      });
  };

  if (userLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Container>
        <Row className="m-4">
          <Col>
            <Image src={Error404} alt="Error 404" className="error-404-image" />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <p>Must be logged in to view this page</p>
            <Link to={"/login"}>
              <Button variant="success" size="lg" className="custom-button">
                Login
              </Button>
            </Link>
            <HomeButtons size={"md"} />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="custom-container mt-4">
      <h2 className="mb-4">My Profile</h2>

      <Card className="custom-card">
        <Row>
          {/* Profile Information Section */}
          <Col md={4}>
            <Container className="custom-container mt-2">
              <h4>User Details</h4>

              <h5>Profile Picture:</h5>
              <Image
                className="profile-picture"
                src={userData.photoURL || userImage}
                alt={`${userData.displayName}'s Profile picture`}
                onError={(e) => {
                  e.target.src = userImage;
                }}
              />

              {userData.isAdmin && (
                <p className="mt-3 text-danger">
                  <b>Admin</b>
                </p>
              )}
              <p className="mt-3 mb-1">
                <b>Display Name:</b> {userData.displayName}
              </p>
              <p className="mb-1">
                <b>Email:</b> {userData.email}
              </p>
            </Container>
          </Col>

          {/* Update profile form */}
          <Col md={4}>
            <Card className="custom-card mb-4">
              <h4>Update Profile</h4>
              <Card.Body>
                <Form onSubmit={handleUpdateUserProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Display Name</Form.Label>
                    <Form.Control
                      className="form-controls text-center"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      isInvalid={!!nameError}
                    />
                    <Form.Control.Feedback type="invalid">
                      <b>{nameError}</b>
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Profile Picture URL</Form.Label>
                    <Form.Control
                      className="form-controls"
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Update Profile
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Change password form */}
          <Col md={4}>
            <Card className="custom-card">
              <h4>Change Password</h4>
              <Card.Body>
                <Form onSubmit={handleChangePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      className="form-controls"
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      isInvalid={!!currentPassError}
                    />
                    <Form.Control.Feedback type="invalid">
                      <b>{currentPassError}</b>
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      className="form-controls"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      isInvalid={!!newPassError}
                    />
                    <Form.Control.Feedback type="invalid">
                      <b>{newPassError}</b>
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="success" type="submit">
                    Update Password
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          {/* User Activity Section */}
          <Col>
            <Card className="custom-card">
              <h4>Account Activity</h4>
              <Card.Body className="mt-2 pb-1">
                <p>
                  <b>Orders Placed:</b> {userData.orders.length}
                </p>
                <p>
                  <b>Products in Wishlist:</b> {userData.wishlist.length}
                </p>
                <p>
                  <b>Last Sign in:</b> {userData.lastSignInTime}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card>

      <HomeButtons size={"md"} />
    </Container>
  );
};

export default ProfilePage;
