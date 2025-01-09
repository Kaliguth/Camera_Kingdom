import Swal from "sweetalert2";

const EditProductAlert = (productName) => {
  return Swal.fire({
    title: "Are you sure?",
    text: `Do you want to save these changes to ${productName}?`,
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

export default EditProductAlert;
