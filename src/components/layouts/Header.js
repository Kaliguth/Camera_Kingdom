import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { PiListStar } from "react-icons/pi";
import { BsCart2 } from "react-icons/bs";
import { toast } from "react-toastify";
import logo from "../../assets/logo_small.png";
import userImage from "../../assets/user-nobgnew.png";

const Header = () => {
  const { userLoading, currentUser, userData, logout } = useAuthContext();
  const [cartCount, setCartCount] = useState(userData?.cart?.length || 0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(userData?.cart?.length);
    };

    updateCartCount();
  }, [userData]);

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Navbar expand="lg" className="header hide-on-print">
      <Navbar.Brand
        onAuxClick={(e) => {
          // Allow middle mouse button click to open in new tab like Link tag offers
          // (Using Link tag disables css border support of image's roundedCircle property)
          if (e.button === 1) {
            window.open("/", "_blank");
          }
        }}
      >
        <LinkContainer to="/" className="header-logo-container">
          <Image src={logo} roundedCircle width={100} height={100} />
        </LinkContainer>
      </Navbar.Brand>
      <Navbar.Toggle className="me-3" />
      <Navbar.Collapse className="mt-2 mb-1">
        <Nav>
          <LinkContainer to="/">
            <Nav.Link className="me-3">
              <h5>Home</h5>
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/categories">
            <Nav.Link className="me-3">
              <h5>Categories</h5>
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/contact-us/none">
            <Nav.Link className="me-3">
              <h5>Contact Us</h5>
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about-us">
            <Nav.Link className="me-3">
              <h5>About Us</h5>
            </Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav className="ms-auto me-4">
          {currentUser && (
            <>
              <LinkContainer to="/wishlist">
                <Nav.Link className="d-flex align-items-center ms-auto me-3">
                  <PiListStar
                    size={25}
                    color="cadetblue"
                    style={{ marginTop: "-7px" }}
                  />
                  <h6 className="ms-2">Wishlist</h6>
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/cart">
                <Nav.Link className="d-flex align-items-center ms-auto me-3">
                  {userData && (
                    <span className="cart-count-badge">{cartCount || "0"}</span>
                  )}
                  <BsCart2
                    size={22}
                    color="darkblue"
                    style={{ marginTop: "-10px" }}
                  />
                  <h6 className="ms-2">Cart</h6>
                </Nav.Link>
              </LinkContainer>
            </>
          )}
          {currentUser && !userLoading ? (
            <>
              <Dropdown align="end">
                <Dropdown.Toggle variant="light">
                  <h6 className="d-inline">{userData.displayName} </h6>
                  {
                    <Image
                      src={userData.photoURL || userImage}
                      alt={`${userData.displayName}`}
                      roundedCircle
                      width={30}
                      height={30}
                      onError={(e) => {
                        e.target.src = userImage;
                      }}
                    />
                  }
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <LinkContainer to="/profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                    <Dropdown.Item>Orders</Dropdown.Item>
                  </LinkContainer>
                  {userData.isAdmin && (
                    <LinkContainer to="/admin-dashboard">
                      <Dropdown.Item className="admin-dashboard-text">
                        Admin Dashboard
                      </Dropdown.Item>
                    </LinkContainer>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <LinkContainer to="/login">
              <Nav.Link>
                <h6>Login/Register</h6>
              </Nav.Link>
            </LinkContainer>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
