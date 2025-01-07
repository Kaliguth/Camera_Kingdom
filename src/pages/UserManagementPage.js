import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useUserManagementContext } from "../contexts/UserManagementContext";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Form,
  Card,
} from "react-bootstrap";
import Loader from "../components/utility/Loader";
import Error404 from "../assets/Error404.png";
import UsersTable from "../components/user/UsersTable";
import HomeButtons from "../components/utility/HomeButtons";

const UserManagementPage = () => {
  const { currentUser, userData } = useAuthContext();
  const { users, usersLoading } = useUserManagementContext();
  const navigate = useNavigate();

  // Search and sort states
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [filterRole, setFilterRole] = useState("All");

  // Method to filter and sort users depending on above states
  const filteredUsers = users
    .filter((user) => {
      const input = searchInput.toLowerCase();

      return (
        user.displayName?.toLowerCase().includes(input) ||
        user.email?.toLowerCase().includes(input)
      );
    })
    .filter((user) => {
      if (filterRole === "All") return user;
      if (filterRole === "Admins") return user.isAdmin;
      if (filterRole === "Users") return !user.isAdmin;

      return null;
    })
    .sort((a, b) => {
      const nameA = a.displayName?.toLowerCase() || "";
      const nameB = b.displayName?.toLowerCase() || "";
      const ordersA = a.orders.length || 0;
      const ordersB = b.orders.length || 0;

      if (sortOrder === "A-Z") {
        return nameA < nameB ? -1 : 1;
      } else if (sortOrder === "Z-A") {
        return nameA > nameB ? -1 : 1;
      } else if (sortOrder === "orders-asc") {
        return ordersA > ordersB ? -1 : 1;
      } else {
        return ordersA < ordersB ? -1 : 1;
      }
    });

  // Clear filters handle
  const handleResetFilters = () => {
    setSearchInput("");
    setSortOrder("A-Z");
    setFilterRole("All");
  };

  if (usersLoading) {
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
            <p>
              <b>ADMINS ONLY!</b>
            </p>
            <Button
              variant="success"
              size="lg"
              className="custom-button"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <HomeButtons size={"md"} />
          </Col>
        </Row>
      </Container>
    );
  }

  if (!userData.isAdmin) {
    return (
      <Container>
        <Row className="mt-4">
          <Col>
            <p>You do not have admin privileges</p>
            <HomeButtons size={"lg"} />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="custom-container mt-4">
      <Row className="m-4">
        <h2>User Management</h2>
      </Row>

      <Card className="custom-card">
        <Card.Header>
          <h3>
            <u>Users</u>
          </h3>
        </Card.Header>

        <Card.Body>
          <Row className="justify-content-center mb-3">
            <Col lg={6} md={6} sm={10} xs={10} className="mb-3">
              <h6>
                <b>Search:</b>
              </h6>
              <Form.Control
                className="form-controls"
                type="text"
                placeholder="Search by name or email"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Col>
            <Col lg={2} md={6} sm={5} xs={5}>
              <h6>
                <b>Sort by:</b>
              </h6>
              <Form.Select
                className="form-controls text-center"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="A-Z">Name: A-Z</option>
                <option value="Z-A">Name: Z-A</option>
                <option value="orders-asc">Orders: Ascending</option>
                <option value="orders-desc">Orders: Descending</option>
              </Form.Select>
            </Col>
            <Col lg={2} md={6} sm={5} xs={5} className="mb-3">
              <h6>
                <b>Filter:</b>
              </h6>
              <Form.Select
                className="form-controls text-center"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Admins">Admins</option>
                <option value="Users">Users</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button
                className="custom-button mt-0 mb-3"
                variant="primary"
                size="sm"
                onClick={() => handleResetFilters()}
              >
                Reset Filters
              </Button>
            </Col>
          </Row>

          <h6>(Scroll for more users)</h6>
          <UsersTable users={filteredUsers} />

          {/* <Row className="justify-content-center g-5">
        {filteredUsers.map((user) => (
          <Col lg={6} md={6} sm={10} xs={10} key={user.id}>
            <Card className="order-container" style={{ minHeight: "320px" }}>
              <Row>
                <Card.Title>
                  <u>{user.displayName || "No-Name"}</u>
                </Card.Title>
              </Row>
              <Card.Body>
                <Row className="align-items-center mt-2">
                  <Col lg={4} md={4} sm={5} xs={4}>
                    {
                      <Image
                        src={user.photoURL || userImage}
                        alt={`${user.displayName}'s Profile picture`}
                        className="mb-3"
                        roundedCircle
                        width={80}
                        height={80}
                        onError={(e) => {
                          e.target.src = userImage;
                        }}
                      />
                    }
                  </Col>
                  <Col lg={8} md={8} sm={7} xs={8}>
                    <Card.Text className="mb-3">
                      <b>E-mail:</b> {user.email}
                    </Card.Text>
                    <Card.Text>
                      <b>Role:</b> {user.isAdmin ? "Admin" : "User"}
                    </Card.Text>
                    {user.email !== "ckadmin@camerakingdom.com" && (
                      <Card.Text>
                        <b>Number of Orders:</b> {user.orders.length}
                      </Card.Text>
                    )}
                    <Card.Text>
                      <b>Last sign-in:</b>{" "}
                      {user.lastSignInTime || "Unavailable"}
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
              {user.email !== "ckadmin@camerakingdom.com" ? (
                <Row>
                  <Col>
                    <Button
                      variant="warning"
                      size="sm"
                      className="custom-button mb-0"
                      onClick={() => handleUpdateUserRole(user)}
                    >
                      {user.isAdmin
                        ? "Remove Admin Permissions"
                        : "Give Admin Permissions"}
                    </Button>
                    <Button
                      className="custom-button mb-0"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                    >
                      Delete User
                    </Button>
                  </Col>
                </Row>
              ) : (
                <h5 className="mt-2 pt-3">
                  <b>This user cannot be modified</b>
                </h5>
              )}
            </Card>
          </Col>
        ))}
      </Row> */}
        </Card.Body>
      </Card>
      <Link to={"/admin-dashboard"}>
        <Button className="custom-button mt-4" variant="warning" size={"md"}>
          Back to Admin Dashboard
        </Button>
      </Link>
      <HomeButtons size={"md"} />
    </Container>
  );
};

export default UserManagementPage;
