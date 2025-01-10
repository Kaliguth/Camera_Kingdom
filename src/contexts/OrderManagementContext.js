import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { ordersRef } from "../firebase/firestore";
import { deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

const OrderManagementContext = createContext();

export const OrderManagementProvider = ({ children }) => {
  const { currentUser, updateUserData } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    // Fetch all users from Firestore
    const fetchOrders = async () => {
        setOrdersLoading(true);
      try {
        const ordersCollection = await getDocs(ordersRef);
        setOrders(
            ordersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
      setOrdersLoading(false);
    };

    fetchOrders();
  }, []);


  const globalVal = {
    orders,
    ordersLoading
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
