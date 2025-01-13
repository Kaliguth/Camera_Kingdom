import React, { useState } from "react";
import { useMessagesManagementContext } from "../contexts/MessagesManagementContext";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import MessagesTable from "../components/message/MessagesTable";

const AnsweredMessagesPage = () => {
  const { allMessages } = useMessagesManagementContext();

  // Search and sort states
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("old-new");

  // Method to filter messages by search input and sort depending on above states
  const filteredMessages = allMessages
    .filter((message) => {
      const input = searchInput.toLowerCase();

      return (
        message.answered &&
        (message.name?.toLowerCase().includes(input) ||
          message.email?.toLowerCase().includes(input) ||
          message.subject?.toLowerCase().includes(input))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date) || "";
      const dateB = new Date(b.date) || "";
      const nameA = a.name || "";
      const nameB = b.name || "";

      if (sortOrder === "old-new") {
        return dateA - dateB;
      } else if (sortOrder === "new-old") {
        return dateB - dateA;
      } else if (sortOrder === "name A-Z") {
        return nameA > nameB ? -1 : 1;
      } else {
        return nameA < nameB ? -1 : 1;
      }
    });

  // Clear filters handle
  const handleResetFilters = () => {
    setSearchInput("");
    setSortOrder("old-new");
  };

  return (
    <Container className="custom-container">
      <hr className="thick-hr m-5" />

      <Card className="custom-card">
        <Card.Header>
          <h3>
            <u>Answered Messages</u>
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
                placeholder="Search by name, email or subject"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Col>
            <Col lg={3} md={7} sm={8} xs={8} className="mb-3">
              <h6>
                <b>Sort by:</b>
              </h6>
              <Form.Select
                className="form-controls text-center"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="old-new">Old to New</option>
                <option value="new-old">New to Old</option>
                <option value="name A-Z">Name: A-Z</option>
                <option value="name Z-A">Name: Z-A</option>
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

          <h6>(Scroll for more messages)</h6>
          <MessagesTable messages={filteredMessages} />
        </Card.Body>
      </Card>

      <Link to="/admin-dashboard/messages">
        <Button variant="warning" size="md" className="mt-4">
          Close
        </Button>
      </Link>
    </Container>
  );
};

export default AnsweredMessagesPage;
