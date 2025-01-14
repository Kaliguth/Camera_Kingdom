import Swal from "sweetalert2";

// Alert component for removing reviews
const RemoveReviewAlert = (review, userData) => {
  return Swal.fire({
    title: "Are you sure?",
    html:
      userData.displayName === review.userData.displayName
        ? "Do you want to remove your review?"
        : `Do you want to remove <b>${review.userData.displayName}</b>'s review?`,
    icon: "warning",
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

export default RemoveReviewAlert;
