import Swal from "sweetalert2";

// Alert component for deleting messages
const DeleteMessageAlert = (message) => {
  // If the message is unread show an alert window to notify the user this cannot be done
  if (message.seenBy.length === 0 || !message.answered) {
    return Swal.fire({
      title: "Action not allowed",
      text: "You cannot delete unread or unanswered messages",
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

  return Swal.fire({
    title: "Are you sure?",
    html: `Do you want to remove <b>${message.name}'s</b> message?`,
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

export default DeleteMessageAlert;
