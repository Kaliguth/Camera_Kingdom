import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useUserManagementContext } from "../../contexts/UserManagementContext";
import { Table, Button, Container, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import UpdateUserRoleAlert from "../alerts/UpdateUserRoleAlert";
import DeleteUserAlert from "../alerts/DeleteUserAlert";

const OrdersTable = ({ orders }) => {
  const { currentUser } = useAuthContext();
  const { updateUserRole, deleteUser } = useUserManagementContext();
  const navigate = useNavigate();

  // Update user role handle (admin or user)
  const handleUpdateUserRole = (user) => {
    UpdateUserRoleAlert(user, currentUser)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return updateUserRole(user.id);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.info(
          `${user.displayName} is now ${user.isAdmin ? "a user" : "an admin"}`
        );

        // Navigate to home page if the currently logged in user was changed to a user
        if (user.id === currentUser.uid) {
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("Role change canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  // Delete user handle
  const handleDeleteUser = (user) => {
    DeleteUserAlert(user, currentUser)
      .then((isConfirmed) => {
        if (isConfirmed) {
          return deleteUser(user.id);
        } else {
          throw new Error("canceled");
        }
      })
      .then(() => {
        toast.success(`${user.displayName} has been successfully deleted`);
      })
      .catch((error) => {
        if (error.message === "canceled") {
          console.log("User deletion canceled by the user");
        } else {
          toast.error(error.message);
        }
      });
  };

  return (
    <Container
      className="mt-4 p-0"
      style={{ maxHeight: "595px", overflowY: "auto" }}
    >
      <Table striped bordered hover responsive className="m-0">
        <thead className="text-center align-middle">
          <tr>
            <th>Order ID</th>
            <th>Order Number</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Delivery Option</th>
            <th>Number of Products</th>
            <th>Total Price</th>
            <th>status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderNumber || "Unavailable"}</td>
              <td>{order.customer.fullName}</td>
              <td>{order.purchase.date}</td>
              <td>{order.shipping.deliveryOption}</td>
              <td>{order.purchase.products.length}</td>
              <td>{order.purchase.discountedPrice}</td>
              <td>{order.status}</td>
              <td>
                {
                  <Container className="d-flex justify-content-center gap-2">
                    <Button variant="primary" size="sm">
                      View
                    </Button>
                    <Button variant="warning" size="sm">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      Delete
                    </Button>
                  </Container>
                }
              </td>
            </tr>
          ))}
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td>id</td>
            <td>number</td>
            <td>user</td>
            <td>date</td>
            <td>delivery</td>
            <td>products</td>
            <td>price</td>
            <td>status</td>
            <td>
              {
                <Container className="d-flex justify-content-center gap-2">
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                  <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </Container>
              }
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default OrdersTable;
