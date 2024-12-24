import Swal from "sweetalert2";

const DeleteUserAlert = (user, currentUser) => {
  // If the user to be deleted is the currently logged in user -
  // Show an alert window to notify the user this cannot be done
  if (user.id === currentUser.uid) {
    return Swal.fire({
      title: "Action not allowed",
      text: "You cannot delete your own user from the system",
      icon: "warning",
      confirmButtonText: "OK",
    })
      .then(() => {
        return false;
      })
      .catch((error) => {
        console.log("Error showing alert window: ", error);
        throw new Error(
          "An unexpected error occured. Please try again or contact support"
        );
      });
  }

  // If the user to be deleted is different -
  // Show a confirmation alert window for the user
  return Swal.fire({
    title: "Are you sure?",
    text: `Do you want to remove ${user.displayName}'s user?`,
    icon: "question",
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

export default DeleteUserAlert;
