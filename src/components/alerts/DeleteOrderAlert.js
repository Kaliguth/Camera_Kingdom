import Swal from "sweetalert2";

// Alert component for deleting orders
const DeleteOrderAlert = (order) => {
  return Swal.fire({
    title: "Are you sure?",
    html: `
    ${order.status !== "Completed" && order.status !== "Refunded" 
      ? "<b>NOTICE THIS ORDER IS NOT COMPLETED OR REFUNDED!</b><br>" 
      : ""}
    Do you want to remove order number <b>${order.orderNumber}</b>?`,
    icon:
      order.status !== "Completed" || order.status !== "Refunded"
        ? "warning"
        : "question",
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

export default DeleteOrderAlert;
