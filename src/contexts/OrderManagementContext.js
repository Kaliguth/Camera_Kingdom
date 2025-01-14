import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { useValidationContext } from "./ValidationContext";
import { useProductContext } from "./ProductContext";
import { ordersRef } from "../firebase/firestore";
import { deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

// Order context to store and provide methods
const OrderManagementContext = createContext();

export const OrderManagementProvider = ({ children }) => {
  const { currentUser, updateUserData, getUserDocRefByUid } = useAuthContext();
  const { orderNumberTaken, validateEmail, validateName, validatePhoneNumber } =
    useValidationContext();
  const { updateProductsStock } = useProductContext();
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Use effect to fetch all orders from firestore
  useEffect(() => {
    // Fetch all orders from Firestore
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const ordersCollection = await getDocs(ordersRef);
        setAllOrders(
          ordersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.log("Error fetching orders: ", error);
      }
      setOrdersLoading(false);
    };

    fetchOrders();
  }, []);

  // Method to get order by ID from orders collection
  const getOrder = (orderId) => {
    const orderDocRef = getOrderDocRef(orderId);
    return getDoc(orderDocRef)
      .then((orderDoc) => {
        if (orderDoc.exists()) {
          return { id: orderDoc.id, ...orderDoc.data() };
        } else {
          // If the document doesn't exist, return null
          return null;
        }
      })
      .catch((error) => {
        console.log(`Error fetching order ID ${orderId}: `, error);
      });
  };

  // Method to get an order document reference by id (for document changes)
  const getOrderDocRef = (id) => {
    const orderRef = doc(ordersRef, id);

    return orderRef;
  };

  // Method to add a new order to the allOrders array
  const updateAllOrders = (newOrder) => {
    setAllOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  // Method to update a user's orders after order changes
  const updateUserOrders = (userId) => {
    // Get all order docs from orders collection
    getDocs(ordersRef)
      .then((orders) => {
        // Initiate an orders array
        const userOrders = [];

        // Go over all orders and add ones that belong to the user
        orders.forEach((doc) => {
          const orderData = doc.data();
          if (orderData.customer.userId === userId) {
            userOrders.push({ ...orderData });
          }
        });

        const userDocRef = getUserDocRefByUid(userId);
        // Update the user's document with the found orders in firestore
        updateDoc(userDocRef, { orders: userOrders })
          .then(() => {
            if (currentUser.uid === userId) {
              updateUserData({ orders: userOrders });
            }
          })
          .catch((error) => {
            console.log("Error updating user's orders array: ", error);
          });
      })
      .catch((error) => {
        console.log("Error updating user orders: ", error);
      });
  };

  // Method to update order's details
  const updateOrderDetails = (order) => {
    // Validations:
    // Throws error if order number is empty or invalid
    if (!order.orderNumber || order.orderNumber <= 0) {
      return Promise.reject(new Error("Invalid order number"));
    }
    // Throws error if order number is taken
    // Uses order.id to compare all order IDs with order ID that the user is requesting to change
    return orderNumberTaken(order.orderNumber, order.id)
      .then((orderNumberTaken) => {
        if (orderNumberTaken) {
          return Promise.reject(new Error("Order number is already taken"));
        }
        // Throws error if empty email or invalid email format
        if (!order.customer.email || order.customer.email.trim() === "") {
          return Promise.reject(new Error("Email cannot be empty"));
        }
        if (!order.customer.email || !validateEmail(order.customer.email)) {
          return Promise.reject(new Error("Invalid email format"));
        }
        // Throws error if full name is empty
        if (
          !order.customer.fullName ||
          !validateName(order.customer.fullName)
        ) {
          return Promise.reject(new Error("Full name cannot be empty"));
        }
        // Throws error if phone number is empty or invalid
        if (!order.customer.phoneNumber || order.customer.phoneNumber <= 0) {
          return Promise.reject(new Error("Phone number cannot be empty"));
        }
        if (
          !order.customer.phoneNumber ||
          !validatePhoneNumber(order.customer.phoneNumber)
        ) {
          return Promise.reject(new Error("Invalid phone number"));
        }
        // Throws error if any address detail is empty
        if (
          !order.shipping.streetName ||
          order.shipping.streetName.trim() === ""
        ) {
          return Promise.reject(new Error("Street name cannot be empty"));
        }
        if (
          !order.shipping.houseNumber ||
          order.shipping.houseNumber.trim() === ""
        ) {
          return Promise.reject(new Error("House number cannot be empty"));
        }
        if (!order.shipping.city || order.shipping.city.trim() === "") {
          return Promise.reject(new Error("City cannot be empty"));
        }

        const orderRef = getOrderDocRef(order.id);
        return updateDoc(orderRef, order)
          .then(() => {
            // Update the allOrders array after updating the order
            setAllOrders((prevOrders) =>
              prevOrders.map((currentOrder) =>
                currentOrder.id === order.id ? order : currentOrder
              )
            );

            // Update the orders array in the user's doc
            updateUserOrders(order.customer.userId);
          })
          .catch((error) => {
            console.log("Error updating order: ", error);
            throw new Error(
              "Failed to update the order in firestore. Please try again."
            );
          });
      })
      .catch((error) => {
        console.log("Error updating order details: ", error);
        throw new Error(error.message);
        // }
      });
  };

  // Method to delete an order with given ID
  const deleteOrder = (orderIdToDelete) => {
    // Find the order to be deleted
    const orderToDelete = allOrders.find(
      (order) => order.id === orderIdToDelete
    );

    // Attemp deletion only if order is found
    if (orderToDelete) {
      // Get the order's doc reference
      const orderDocRef = getOrderDocRef(orderIdToDelete);

      // Delete the order's doc
      deleteDoc(orderDocRef)
        .then(() => {
          // Update the allOrders array after deleting the order
          setAllOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== orderIdToDelete)
          );

          // Update the orders array in the user's doc
          updateUserOrders(orderToDelete.customer.userId);
        })
        .catch((error) => {
          console.log("Error deleting order: ", error);
          throw new Error("Failed to delete the order");
        });
    } else {
      // If order was not found in the database
      console.log("Order to delete not found");
      throw new Error("Failed to find the order in the database");
    }
  };

  // Method to confirm an order
  const confirmOrder = (orderIdToConfirm) => {
    // Find the order to be confirmed
    const orderToConfirm = allOrders.find(
      (order) => order.id === orderIdToConfirm
    );

    // Attemp confirmation only if order is found and has pending status
    if (orderToConfirm && orderToConfirm.status === "Pending") {
      // Get the order's doc reference
      const orderDocRef = getOrderDocRef(orderIdToConfirm);

      // Change order status to confirmed in the order's doc
      updateDoc(orderDocRef, { status: "Confirmed" })
        .then(() => {
          // Update the allOrders array after changing the status
          setAllOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderIdToConfirm
                ? { ...order, status: "Confirmed" }
                : order
            )
          );

          // Update the orders array in the user's doc
          updateUserOrders(orderToConfirm.customer.userId);
        })
        .catch((error) => {
          console.log(`Error confirming order ID ${orderIdToConfirm}: `, error);
          throw new Error("Failed to confirm the order");
        });
    } else {
      // If order was not found in the database
      console.log(
        "Order to confirm was not found in the database or has already been confirmed"
      );
      throw new Error(
        "Failed to find the order in the database or the order has already been confirmed"
      );
    }
  };

  // Method to refund an order
  const refundOrder = (orderIdToRefund) => {
    // Find the order to be confirmed
    const orderToRefund = allOrders.find(
      (order) => order.id === orderIdToRefund
    );

    // Attemp refund only if order is found and has completed status
    if (orderToRefund && orderToRefund.status === "Completed") {
      // Get the order's doc reference
      const orderDocRef = getOrderDocRef(orderIdToRefund);

      // Change order status to refunded in the order's doc
      updateDoc(orderDocRef, { status: "Refunded" })
        .then(() => {
          // Update all order's products stock
          const orderProducts = orderToRefund.purchase.products;
          return updateProductsStock(orderProducts, "refund");
        })
        .then(() => {
          // Update the allOrders array after changing the status
          setAllOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderIdToRefund
                ? { ...order, status: "Refunded" }
                : order
            )
          );

          // Update the orders array in the user's doc
          updateUserOrders(orderToRefund.customer.userId);
        })
        .catch((error) => {
          console.log(
            `Error refunding order ID ${orderIdToRefund}: `,
            error,
            "Attempting to rollback changes..."
          );

          // If any action fails - change order status back and throw an error (just in case)
          return updateDoc(orderDocRef, { status: "Completed" })
            .then(() => {
              // Change order status back in allOrders array
              setAllOrders((prevOrders) =>
                prevOrders.map((order) =>
                  order.id === orderIdToRefund
                    ? { ...order, status: "Completed" }
                    : order
                )
              );

              // Update the orders array in the user's doc again
              updateUserOrders(orderToRefund.customer.userId);

              // Log successful rollback
              console.log("Order status rollback successful");

              // Finally throw an error
              throw new Error("Failed to refund the order. Please try again.");
            })
            .catch((rollbackError) => {
              console.log(
                `Order status rollback failed for order ID ${orderIdToRefund}: `,
                rollbackError
              );

              throw new Error(
                "Refund and order status rollback failed. Please contact tech support."
              );
            });
        });
    } else {
      // If order was not found in the database
      console.log(
        "Order to refund was not found in the database or has already been refunded"
      );
      throw new Error(
        "Failed to find the order in the database or the order has already been refunded"
      );
    }
  };

  // Method to cancel orders (for customers)
  const cancelOrder = (orderIdToCancel) => {
    // Find the order to be canceled
    const orderToCancel = allOrders.find(
      (order) => order.id === orderIdToCancel
    );

    // Attemp cancelation only if order is found and has pending status
    if (orderToCancel && orderToCancel.status === "Pending") {
      // Get the order's doc reference
      const orderDocRef = getOrderDocRef(orderIdToCancel);

      // Change order status to canceled in the order's doc
      updateDoc(orderDocRef, { status: "Canceled" })
        .then(() => {
          // Update the allOrders array after changing the status
          setAllOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderIdToCancel
                ? { ...order, status: "Canceled" }
                : order
            )
          );

          // Update the orders array in the user's doc
          updateUserOrders(orderToCancel.customer.userId);
        })
        .catch((error) => {
          console.log(`Error canceling order ID ${orderIdToCancel}: `, error);
          throw new Error(
            "Failed to cancel your order. Please try again or contact support."
          );
        });
    } else {
      // If order was not found in the database
      console.log(
        "Order to cancel was not found in the database or has already been canceled"
      );
      throw new Error(
        "Failed to cancel your order. Please try again or contact support."
      );
    }
  };

  const globalVal = {
    allOrders,
    ordersLoading,
    getOrder,
    updateAllOrders,
    updateOrderDetails,
    deleteOrder,
    confirmOrder,
    refundOrder,
    cancelOrder,
  };

  return (
    <OrderManagementContext.Provider value={globalVal}>
      {children}
    </OrderManagementContext.Provider>
  );
};

export const useOrderManagementContext = () => {
  return useContext(OrderManagementContext);
};
