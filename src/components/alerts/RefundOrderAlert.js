import Swal from "sweetalert2";

// Alert component for refunding orders
const RefundOrderAlert = (order) => {
  return Swal.fire({
    title: "Are you sure?",
    html: `Do you want to refund order number <b>${order.orderNumber}</b>?`,
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

export default RefundOrderAlert;
