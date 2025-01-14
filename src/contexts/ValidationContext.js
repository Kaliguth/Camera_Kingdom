// Context for input validation and formatting methods
import React, { createContext, useContext } from "react";
import { usersRef, couponsRef, ordersRef } from "../firebase/firestore";
import { getDocs } from "firebase/firestore";
import { logoMap } from "../assets/LogoMap";


// Validation context to store and provide validation methods
const ValidationContext = createContext();

export const ValidationProvider = ({ children }) => {
  // Validation methods:
  // Email validation
  const validateEmail = (email) => {
    // Must contain email characteristics (@ . domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    // Must contain at least 8 characters, one number, one symbol, and one capital letter
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Display name validation
  const validateName = (name) => {
    // Can't be empty
    return name.trim().length > 0;
  };

  // Method to check if the display name is taken
  const displayNameTaken = (name) => {
    return getDocs(usersRef)
      .then((users) => {
        let taken = false;

        users.forEach((doc) => {
          const userData = doc.data();
          if (userData.displayName.toLowerCase() === name.toLowerCase()) {
            taken = true;
          }
        });

        return taken;
      })
      .catch((error) => {
        console.log("Error checking display name: ", error);
        throw new Error("Failed to check display name");
      });
  };

  // Method to check if order number is taken
  // Also uses order id of the order the user is requesting to change
  const orderNumberTaken = (number, orderId) => {
    return getDocs(ordersRef)
      .then((orders) => {
        let taken = false;

        orders.forEach((doc) => {
          const currentId = doc.id;
          const orderData = doc.data();
          if (currentId !== orderId && orderData.orderNumber === number) {
            taken = true;
          }
        });

        return taken;
      })
      .catch((error) => {
        console.log("Error checking order number: ", error);
        throw new Error("Failed to check order number");
      });
  };

  // Phone number validation
  const validatePhoneNumber = (phoneNumber) => {
    // Must be at least 9 characters long (home phone number length) digits only
    const phoneNumberRegex = /^\d+$/;

    return phoneNumberRegex.test(phoneNumber) && phoneNumber.length >= 9;
  };

  // Credit card number validation
  const validateCreditCardNumber = (cardNumber) => {
    // Must be 19 characters long (16 numbers and 3 spaces) digits only
    const creditCardRegex = /^[\d\s]+$/;

    return creditCardRegex.test(cardNumber) && cardNumber.length === 19;
  };

  // Credit card's expiration date validation
  const validateExpirationDate = (expirationDate) => {
    // Must include 4 digits and one slash between them
    // Month number to the left must be between 01-12
    const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    return expirationRegex.test(expirationDate) && expirationDate.length === 5;
  };

  // Credit card's CVC security code validation
  const validateCvc = (cvc) => {
    // Must be 3 character long - digits only
    const cvcRegex = /^\d+$/;

    return cvcRegex.test(cvc) && cvc.length === 3;
  };

  // Method to get a coupon with given code
  const getCoupon = (code) => {
    // Error handling if no code is given
    if (!code || code.trim() === "")
      return Promise.reject(new Error("Please fill in a coupon code"));

    // Get all coupon docs from coupons collection
    return getDocs(couponsRef)
      .then((coupons) => {
        // Variable to hold coupon data if found
        let couponData = null;

        // Go over all coupons to find coupon with the same code
        coupons.forEach((coupon) => {
          const currentCouponCode = coupon.data().code;
          // If same code - save coupon data
          if (currentCouponCode === code) {
            couponData = coupon.data();
          }
        });

        // Return the coupon data if found
        // Null if not found
        return couponData;
      })
      .catch((error) => {
        console.log("Error checking coupon code: ", error);
        // Return null if an error occured
        return null;
      });
  };

  // Method to format price text with commas and currency sign
  const formatPrice = (price) => {
    const formattedPrice = price.toLocaleString("en-US", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
    });

    return formattedPrice;
  };

  // Method to format style for small square logos
  const smallSquareLogoStyle = (brand) => {
    const smallSquareLogoStyle =
      brand === "Nikon" ||
      brand === "Leica" ||
      brand === "Zeiss" ||
      brand === "DJI" ||
      brand === "Insta360" ||
      brand === "Skytex" ||
      logoMap[brand] === undefined
        ? { width: "40px", height: "35px" }
        : {};

    return smallSquareLogoStyle;
  };

  // Method to format style for large square logos
  const largeSquareLogoStyle = (brand) => {
    const largeSquareLogoStyle =
      brand === "Nikon" ||
      brand === "Leica" ||
      brand === "Zeiss" ||
      brand === "DJI" ||
      brand === "Insta360" ||
      brand === "Skytex" ||
      logoMap[brand] === undefined
        ? { width: "70px", height: "70px" }
        : {};

    return largeSquareLogoStyle;
  };

  const globalVal = {
    validateEmail,
    validatePassword,
    validateName,
    displayNameTaken,
    orderNumberTaken,
    validatePhoneNumber,
    validateCreditCardNumber,
    validateExpirationDate,
    validateCvc,
    getCoupon,
    formatPrice,
    smallSquareLogoStyle,
    largeSquareLogoStyle,
  };

  return (
    <ValidationContext.Provider value={globalVal}>
      {children}
    </ValidationContext.Provider>
  );
};

export const useValidationContext = () => useContext(ValidationContext);
