import Swal from "sweetalert2";

// Alert component for updating user role (admin/user)
const UpdateUserRoleAlert = (user, currentUser) => {
  // Show a confirmation alert window customized based on logged in user
  // (Different texts and icon if logged in user and user to update are the same)
  return Swal.fire({
    title:
      user.id === currentUser.uid ? "This is your own user!" : "Are you sure?",
    html:
      user.id === currentUser.uid
        ? "Are you sure you want to remove your admin permissions?<br><b>You will be sent back to the home page</b>"
        : `Do you want to ${
            user.isAdmin
              ? "remove admin permissions from "
              : "give admin permissions to "
          } <b>${user.displayName}</b>?`,
    icon: user.id === currentUser.uid ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  })
    .then((result) => {
      // Returns true if "Confirm" is clicked
      return result.isConfirmed;
    })
    .catch((error) => {
      console.log("Error showing confirmation alert window: ", error);
      throw new Error(
        "An unexpected error occured. Please try again or contact support"
      );
    });
};

export default UpdateUserRoleAlert;
