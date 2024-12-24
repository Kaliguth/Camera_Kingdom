import Swal from "sweetalert2";

const UpdateUserRoleAlert = (user, currentUser) => {
  // Show a confirmation alert window customized based on logged in user
  // (Different texts and icon if logged in user and user to update are the same)
  return Swal.fire({
    title:
      user.id === currentUser.uid ? "This is your own user!" : "Are you sure?",
    text:
      user.id === currentUser.uid
        ? "Are you sure you want to remove admin permissions? (This will send you back to the home page)"
        : `Do you want to ${
            user.isAdmin
              ? "remove admin permissions from "
              : "give admin permissions to "
          } ${user.displayName}?`,
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
