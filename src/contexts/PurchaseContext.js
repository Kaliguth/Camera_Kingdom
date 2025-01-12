import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { useCartContext } from "./CartContext";
import { useValidationContext } from "./ValidationContext";
import { ordersRef } from "../firebase/firestore";
import { getDocs, addDoc, updateDoc } from "firebase/firestore";
import { useProductContext } from "./ProductContext";

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const { currentUser, userData, updateUserData, userDocRef } =
    useAuthContext();
  const { cart, setCart, cartTotalPrice } = useCartContext();
  const { updateProductsStock } = useProductContext();
  const {
    validateEmail,
    validateName,
    validatePhoneNumber,
    validateCreditCardNumber,
    validateExpirationDate,
    validateCvc,
  } = useValidationContext();
  // State to determine next order number
  const [nextOrderNumber, setNextOrderNumber] = useState(0);

  // useEffect to fetch the orders collection size for next order number
  useEffect(() => {
    const fetchOrderNumber = () => {
      getDocs(ordersRef)
        .then((ordersCollection) => {
          // Set next order number based on the number of orders in the collection + 1000
          setNextOrderNumber(ordersCollection.size + 1000);
        })
        .catch((error) => {
          console.log("Error fetching orders collection: ", error);
          // Order number -1 to indicate failure
          setNextOrderNumber(-1);
        });
    };

    fetchOrderNumber();
  }, []);

  // Get order's total price (shipping excluded)
  const orderTotalPrice = () => {
    let totalPrice = 0;

    cart.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    return totalPrice;
  };

  // Get order's shipping price
  const shippingPrice = (deliveryOption) => {
    if (deliveryOption === "express") {
      if (cartTotalPrice() > 500) {
        return Number(0);
      } else {
        return Number(60);
      }
    } else {
      return Number(0);
    }
  };

  // Get one payment price (תשלום)
  const orderPayment = (totalPrice, numberOfPayments) => {
    const payment = totalPrice / numberOfPayments;

    return payment;
  };

  // Get price after coupon discount
  const discountedPrice = (totalPrice, discount) => {
    const finalPrice = totalPrice * (1 - discount / 100);

    return parseFloat(finalPrice.toFixed(2));
  };

  // Method to create a new order document
  const createOrderDocument = (shippingDetails, paymentDetails) => {
    // Get the order's total price
    const orderTotalPrice =
      cartTotalPrice() + shippingPrice(shippingDetails.deliveryOption);

    // Create the new order document
    const order = {
      orderNumber: nextOrderNumber,
      status: "Pending",
      purchase: {
        products: cart,
        coupon: paymentDetails.coupon?.code || null,
        discount: paymentDetails.coupon
          ? `${paymentDetails.coupon.discount}%`
          : null,
        shippingPrice: shippingPrice(shippingDetails.deliveryOption),
        productsPrice: cartTotalPrice(),
        totalPrice: orderTotalPrice,
        discountedPrice:
          discountedPrice(orderTotalPrice, paymentDetails.coupon?.discount) ||
          orderTotalPrice,
        date: new Date().toDateString(),
      },
      customer: {
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        fullName: shippingDetails.fullName,
        phoneNumber: shippingDetails.phoneNumber,
        email: shippingDetails.email,
      },
      shipping: {
        streetName: shippingDetails.streetName,
        houseNumber: shippingDetails.houseNumber,
        city: shippingDetails.city,
        deliveryOption: shippingDetails.deliveryOption,
        deliveryInfo: shippingDetails.deliveryInfo,
      },
      payment: {
        cardHolderName: paymentDetails.cardHolderName,
        cardNumber: paymentDetails.cardNumber,
        expirationDate: paymentDetails.expirationDate,
        cvc: paymentDetails.cvc,
        numberOfPayments: paymentDetails.numberOfPayments,
      },
    };

    return order;
  };

  // Method to finalize and create the order
  const completeOrder = (orderDetails, confirm) => {
    const shippingDetails = orderDetails.shipping;
    const paymentDetails = orderDetails.payment;

    // Shipping details error handling
    if (!validateName(shippingDetails.fullName)) {
      return Promise.reject(new Error("Please fill in your name"));
    }
    if (!shippingDetails.phoneNumber || shippingDetails.phoneNumber === "") {
      return Promise.reject(new Error("Please fill in your phone number"));
    }
    if (!validatePhoneNumber(shippingDetails.phoneNumber)) {
      return Promise.reject(new Error("Invalid phone number"));
    }
    if (!shippingDetails.email || shippingDetails.email === "") {
      return Promise.reject(new Error("Please fill in your email"));
    }
    if (!validateEmail(shippingDetails.email)) {
      return Promise.reject(new Error("Invalid email format"));
    }
    if (!shippingDetails.streetName || shippingDetails.streetName === "") {
      return Promise.reject(new Error("Please fill in the street name"));
    }
    if (!shippingDetails.houseNumber || shippingDetails.houseNumber === "") {
      return Promise.reject(new Error("Please fill in the house number"));
    }
    if (!shippingDetails.city || shippingDetails.city === "") {
      return Promise.reject(new Error("Please fill in the city"));
    }
    if (shippingDetails.deliveryOption === "None") {
      return Promise.reject(new Error("Please choose a delivery option"));
    }

    // Shipping details error handling
    if (
      !paymentDetails.cardHolderName ||
      paymentDetails.cardHolderName === ""
    ) {
      return Promise.reject(new Error("Please fill in the cardholder name"));
    }
    if (!paymentDetails.cardNumber || paymentDetails.cardNumber === "") {
      return Promise.reject(new Error("Please fill in the card number"));
    }
    if (!validateCreditCardNumber(paymentDetails.cardNumber)) {
      return Promise.reject(new Error("Invalid card number"));
    }
    if (
      !paymentDetails.expirationDate ||
      paymentDetails.expirationDate === ""
    ) {
      return Promise.reject(
        new Error("Please provide the card's expiration date")
      );
    }
    if (!validateExpirationDate(paymentDetails.expirationDate)) {
      return Promise.reject(new Error("Invalid expiration date (MM/YY)"));
    }
    if (!paymentDetails.cvc || paymentDetails.cvc === "") {
      return Promise.reject(
        new Error("Please provide the card's CVC security code")
      );
    }
    if (!validateCvc(paymentDetails.cvc)) {
      return Promise.reject(new Error("Invalid CVC (must be a 3 digit code)"));
    }

    // Check if cofirm message is checked
    if (!confirm) {
      return Promise.reject(
        new Error("Please confirm your information and check this box")
      );
    }

    // Create a new order document
    const newOrder = createOrderDocument(shippingDetails, paymentDetails);

    // Check if order number generation failed
    if (newOrder.orderNumber === -1) {
      console.log("Error generating order number");
      return Promise.reject(
        new Error(
          "Failed to generate your order number. Please try again or contact support"
        )
      );
    }

    // Order document ID variable needed to return for summary page
    let orderId;

    // Add the order to the orders collection in Firestore
    return addDoc(ordersRef, newOrder)
      .then((docRef) => {
        // Update the order ID variable with the new document's ID
        orderId = docRef.id;

        // Incrememnt next order number
        setNextOrderNumber((prevOrderNumber) => prevOrderNumber + 1);

        // Update stock for each product in the cart
        return updateProductsStock(cart);
      })
      .then(() => {
        // Empty the user's cart in the app and firebase
        return (
          updateDoc(userDocRef, { cart: [] })
            .then(() => {
              // Clear products from the cart state and local storage userData cart
              // Also add new order to local storage orders
              const currentOrders = userData.orders;
              const updatedOrders = [...currentOrders, newOrder];
              const updatedUserData = {
                ...userData,
                cart: [],
                orders: updatedOrders,
              };
              updateUserData(updatedUserData);
              setCart([]);

              // Add the new order to the user's orders array
              return updateDoc(userDocRef, {
                orders: updatedOrders,
              });
            })
            // Return the new order document ID for summary
            .then(() => orderId)
            .catch((error) => {
              console.log("Error completing order - document updates: ", error);
              throw new Error(
                "Failed to complete your order. Please try again or contact support"
              );
            })
        );
      })
      .catch((error) => {
        console.log("Error completing order - product stocks: ", error);
        throw new Error(
          "Failed to complete your order. Please try again or contact support"
        );
      });
  };

  const globalVal = {
    shippingPrice,
    orderPayment,
    orderTotalPrice,
    discountedPrice,
    completeOrder,
  };

  return (
    <PurchaseContext.Provider value={globalVal}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => useContext(PurchaseContext);
