import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useAuthContext } from "../contexts/AuthContext";
import userImage from "../assets/user-nobgnew.png";
import HomeButtons from "../components/utility/HomeButtons";

const ProfilePage = () => {
  const { currentUser, userData, update } = useAuthContext();
  //   const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setPhotoURL(currentUser.photoURL || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await update(currentUser, { displayName, photoURL, email });
      alert("Profile updated successfully");
      // alert(currentUser.displayName + " " + currentUser.email + " " + currentUser.photoURL);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!currentUser) {
    return (
      <Container className="mt-4">
        <Row className="mt-4">
          <Col>
            <p>Please log in to view your profile.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="custom-container mt-4">
      <h2 className="mb-3">Profile</h2>
      <Row>
        <Col md={6}>
          <h4 className="mb-3">Update your profile:</h4>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className="mb-3" controlId="formDisplayName">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                className="form-controls"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                className="form-controls"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPhotoURL">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                className="form-controls"
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-4">
              Update Profile
            </Button>
          </Form>
        </Col>
        <Col>
          <h4 className="mb-5">Profile Picture</h4>
          {
            // userData.photoURL && (
              <Image
                src={userData.photoURL || userImage}
                alt={`${userData.displayName}'s Profile picture`}
                className="profile-picture"
                onError={(e) => {
                  e.target.src = userImage;
                }}
              />
            // )
            // : (
            //   <Image src={userImage} className="profile-picture" />
            // )
          }
        </Col>
      </Row>
      <HomeButtons size={"md"} />
    </Container>
  );
};

export default ProfilePage;
