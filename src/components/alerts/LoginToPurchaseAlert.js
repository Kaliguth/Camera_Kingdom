import Swal from "sweetalert2";

// Alert component for when a user attempts to purchase when not logged in
const LoginToPurchaseAlert = () => {
  return Swal.fire({
    title: "Must be logged in!",
    text: "Please login or create an account to add products to your cart",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Login/Register",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  })
    .then((result) => {
      // Returns true if "Login/Register" is clicked
      return result.isConfirmed;
    })
    .catch((error) => {
      console.log("Error showing login to purchase alert: ", error);
      throw new Error(
        "An unexpected error occured. Please try again or contact support"
      );
    });
};

export default LoginToPurchaseAlert;
