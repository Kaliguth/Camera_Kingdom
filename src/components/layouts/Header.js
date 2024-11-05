import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { PiListStar } from "react-icons/pi";
import { BsCart2 } from "react-icons/bs";
import logo from "../../assets/logo_small.png";
import userImage from "../../assets/user-nobgnew.png";

const Header = () => {
  const { userLoading, currentUser, userData, logout } = useAuthContext();
  const [cartCount, setCartCount] = useState(
    JSON.parse(localStorage.getItem("userData"))?.cart.length || 0
  );
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(JSON.parse(localStorage.getItem("userData"))?.cart?.length);
    };

    updateCartCount();
  }, [localStorage.getItem("userData")]);

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert(
          "An error occured while attempting to log out. Please contact support"
        );
        console.error("Logout failed:", error);
      });
  };

  return (
    <Navbar
      bg="light"
      expand="sm"
      className="border-bottom border-5 border-dark"
    >
      <Navbar.Brand>
        <LinkContainer to="/" className="header-logo-container">
          <Image src={logo} roundedCircle width={100} height={100} />
        </LinkContainer>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
      <Navbar.Collapse id="basic-navbar-nav" className="mt-2">
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
          <LinkContainer to="/contactus">
            <Nav.Link className="me-3">
              <h5>Contact Us</h5>
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
          {!userLoading && currentUser ? (
            <>
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <h6 className="d-inline">{currentUser.displayName} </h6>
                  {currentUser.photoURL ? (
                    <Image
                      src={currentUser.photoURL}
                      roundedCircle
                      width={30}
                      height={30}
                    />
                  ) : (
                    <Image
                      src={userImage}
                      roundedCircle
                      width={35}
                      height={35}
                    />
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <LinkContainer to="/profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                    <Dropdown.Item>Orders</Dropdown.Item>
                  </LinkContainer>
                  {userData.isAdmin && (
                    <LinkContainer to="/manager">
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
              {/* {userData.role === "admin" && (
                <LinkContainer to="/manager">
                  <Nav.Link>
                    <h5>Admin Dashboard</h5>
                  </Nav.Link>
                </LinkContainer>
              )} */}
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
