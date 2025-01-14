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

// User management page in admin dashboard
const UserManagementPage = () => {
  const { currentUser, userData } = useAuthContext();
  const { allUsers, usersLoading } = useUserManagementContext();
  const navigate = useNavigate();

  // Search and sort states
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [filterRole, setFilterRole] = useState("all");

  // Method to filter and sort users depending on above states
  const filteredUsers = allUsers
    .filter((user) => {
      const input = searchInput.toLowerCase();

      return (
        user.id?.toLowerCase().includes(input) ||
        user.displayName?.toLowerCase().includes(input) ||
        user.email?.toLowerCase().includes(input)
      );
    })
    .filter((user) => {
      if (filterRole === "all") return user;
      if (filterRole === "admins") return user.isAdmin;
      if (filterRole === "users") return !user.isAdmin;

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
    setFilterRole("all");
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
                placeholder="Search by user ID, name or email"
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
                <option value="all">All Roles</option>
                <option value="admins">Admins</option>
                <option value="users">Users</option>
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
