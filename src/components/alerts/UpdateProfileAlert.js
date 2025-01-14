import Swal from "sweetalert2";

// Alert component for updating profiles
const UpdateProfileAlert = () => {
  return Swal.fire({
    title: "Are you sure?",
    text: "Do you want to update your profile picture and display name?",
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

export default UpdateProfileAlert;
