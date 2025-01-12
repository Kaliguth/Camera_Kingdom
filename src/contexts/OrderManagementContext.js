import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { useValidationContext } from "./ValidationContext";
import { ordersRef } from "../firebase/firestore";
import { deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

const OrderManagementContext = createContext();

export const OrderManagementProvider = ({ children }) => {
  const { currentUser, updateUserData } = useAuthContext();
  const { orderNumberTaken, validateEmail, validateName, validatePhoneNumber } =
    useValidationContext();
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

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
        console.error("Error fetching orders: ", error);
      }
      setOrdersLoading(false);
    };

    fetchOrders();
  }, []);

  // Method to get order by ID
  const getOrder = (orderId) => {
    const order = allOrders.find((order) => order.id === orderId) || null;

    return order;
  };

  // Method to update order's details
  const updateOrderDetails = (order) => {
    // Validations:
    // Throws error if order number is empty or invalid
    if (!order.orderNumber || order.orderNumber <= 0) {
      return Promise.reject(new Error("Invalid order number"));
    }
    return orderNumberTaken(order.orderNumber, order.id).then(
      (orderNumberTaken) => {
        // Throws error if order number is taken
        if (orderNumberTaken) {
          return Promise.reject(new Error("Order number is already taken"));
        }
        // Throws error if empty email or invalid email format
        if (!order.customer.email || order.customer.email.trim() === "") {
          return Promise.reject(new Error("Please fill in the email"));
        }
        if (!validateEmail(order.customer.email)) {
          return Promise.reject(new Error("Invalid email format"));
        }
        // Throws error if full name is empty
        if (!validateName(order.customer.fullName)) {
          return Promise.reject(new Error("Full name cannot be empty"));
        }
        // Throws error if phone number is empty or invalid
        if (!order.customer.phoneNumber || order.customer.phoneNumber <= 0) {
          return Promise.reject(new Error("Please fill in the phone number"));
        }
        if (!validatePhoneNumber(order.customer.phoneNumber)) {
          return Promise.reject(new Error("Invalid phone number"));
        }
        // Throws error if any address detail is empty
        if (
          !order.shipping.streetName ||
          order.shipping.streetName.trim() === ""
        ) {
          return Promise.reject(new Error("Please fill in the street name"));
        }
        if (
          !order.shipping.houseNumber ||
          order.shipping.houseNumber.trim() === ""
        ) {
          return Promise.reject(new Error("Please fill in the house number"));
        }
        if (!order.shipping.city || order.shipping.city.trim() === "") {
          return Promise.reject(new Error("Please fill in the city"));
        }
      }
    );
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
      const orderDocRef = doc(ordersRef, orderIdToDelete);

      // Delete the order's doc
      deleteDoc(orderDocRef)
        .then(() => {
          // Update the orders array after deleting the order
          setAllOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== orderIdToDelete)
          );
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

  const confirmOrder = (orderIdToConfirm) => {
    // Find the order to be confirmed
    const orderToConfirm = allOrders.find(
      (order) => order.id === orderIdToConfirm
    );

    // Attemp confirmation only if order is found and has pending status
    if (orderToConfirm && orderToConfirm.status === "Pending") {
      // Get the order's doc reference
      const orderDocRef = doc(ordersRef, orderIdToConfirm);

      // Change order status to confirmed the order's doc
      updateDoc(orderDocRef, { status: "Confirmed" })
        .then(() => {
          // Update the orders array after changing the status
          setAllOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderIdToConfirm
                ? { ...order, status: "Confirmed" }
                : order
            )
          );
        })
        .catch((error) => {
          console.log("Error confirming order: ", error);
          throw new Error("Failed to confirm the order");
        });
    } else {
      // If order was not found in the database
      console.log(
        "Order to confirm not found or it has already been confirmed"
      );
      throw new Error(
        "Failed to find the order in the database or the order has already been confirmed"
      );
    }
  };

  const globalVal = {
    allOrders,
    ordersLoading,
    getOrder,
    deleteOrder,
    confirmOrder,
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
