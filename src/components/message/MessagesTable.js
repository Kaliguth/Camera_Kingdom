import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useMessagesManagementContext } from "../../contexts/MessagesManagementContext";
import { Table, Button, Container, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import DeleteMessageAlert from "../alerts/DeleteMessageAlert";
import MarkMessageAnsweredAlert from "../alerts/MarkMessageAnsweredAlert";

// Table component to show messages in admin dashboard
const MessagesTable = ({ messages }) => {
  const { userData } = useAuthContext();
  const { markMessageSeen, markMessageAnswered, deleteMessage } =
    useMessagesManagementContext();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false); // boolean to toggle selected message message modal

  // View message handle (opens modal with the message's details)
  // Also marks the message as read by the user
  const handleViewMessage = (message, userName) => {
    setSelectedMessage(message);

    markMessageSeen(message.id, userName);

    // Open modal after a delay to avoid clashes of different renders (modal open and allMessages update)
    setTimeout(() => {
      setShowModal(true);
    }, 200);
  };

  // Close modal handle
  const handleCloseModal = () => {
    setShowModal(false);

    setSelectedMessage(null);
  };

  // Mark as answered handle
  const handleMarkAnswered = (message) => {
    MarkMessageAnsweredAlert(message)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return markMessageAnswered(message.id);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success("The message has been successfully marked as answered");
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Message marking canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  // Delete message handle
  const handleDeleteMessage = (message) => {
    DeleteMessageAlert(message)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return deleteMessage(message.id);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success("The message has been successfully deleted");
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Message deletion canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  return (
    <Container
      className="mt-4 p-0"
      style={{ maxHeight: "570px", overflowY: "auto" }}
    >
      <Table striped bordered hover responsive className="m-0">
        <thead className="text-center align-middle">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody className="text-center align-middle">
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.name}</td>
              <td>{message.email}</td>
              <td>{message.subject}</td>
              <td>{message.date}</td>
              <td>
                <Container className="d-flex justify-content-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleViewMessage(message, userData.displayName)
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteMessage(message)}
                  >
                    Delete
                  </Button>

                  {/* Modal for displaying message details */}
                  <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    dialogClassName="modal-dialog-centered custom-message-modal"
                  >
                    <Modal.Header
                      closeButton
                      className="custom-message-modal-header"
                    >
                      <Modal.Title>Message Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="custom-message-modal-body">
                      {selectedMessage && (
                        <div>
                          <p>
                            <b>Date:</b> {selectedMessage.date}
                          </p>
                          <p>
                            <b>Name:</b> {selectedMessage.name}
                          </p>
                          <p>
                            <b>Email:</b> {selectedMessage.email}
                          </p>
                          <p>
                            <b>Subject:</b> {selectedMessage.subject}
                          </p>
                          <p>
                            <b>Message:</b> {selectedMessage.message}
                          </p>
                          <p>
                            <b>Answered:</b>{" "}
                            {selectedMessage.answered ? "Yes" : "No"}
                          </p>
                          {selectedMessage.seenBy.length !== 0 && (
                            <>
                              <p>
                                <b>Seen by:</b>
                              </p>
                              {selectedMessage.seenBy.map((user) => {
                                return <span key={user}>{user}</span>;
                              })}
                            </>
                          )}
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer className="custom-message-modal-footer">
                      {!selectedMessage?.answered && (
                        <Button
                          variant="success"
                          onClick={() => handleMarkAnswered(selectedMessage)}
                        >
                          Mark as Answered
                        </Button>
                      )}
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Container>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MessagesTable;
