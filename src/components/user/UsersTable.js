import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useUserManagementContext } from "../../contexts/UserManagementContext";
import { Table, Button, Container, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import UpdateUserRoleAlert from "../alerts/UpdateUserRoleAlert";
import DeleteUserAlert from "../alerts/DeleteUserAlert";
import userImage from "../../assets/user-nobgnew.png";

// Users table to display users in admin dashboard
const UsersTable = ({ users }) => {
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
            <th>Profile Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Number of Orders</th>
            <th>Last Sign-in</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Image
                  src={user.photoURL || userImage}
                  alt={`${user.displayName}'s Profile picture`}
                  roundedCircle
                  width={60}
                  height={60}
                  onError={(e) => {
                    e.target.src = userImage;
                  }}
                />
              </td>
              <td>{user.displayName || "No-Name"}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? <b>Admin</b> : "User"}</td>
              <td>{user.orders.length}</td>
              <td>{user.lastSignInTime || "Unavailable"}</td>
              <td>
                {user.email !== "ckadmin@camerakingdom.com" ? (
                  <Container className="d-flex justify-content-center gap-2">
                    <Button
                      variant={user.isAdmin ? "warning" : "primary"}
                      size="sm"
                      onClick={() => handleUpdateUserRole(user)}
                    >
                      {user.isAdmin ? "Remove Admin" : "Make Admin"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                    >
                      Delete
                    </Button>
                  </Container>
                ) : (
                  <span>
                    <b>This user cannot be modified</b>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UsersTable;
