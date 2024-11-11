import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { updateDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser, userData, updateUserData, userDocRef } =
    useAuthContext();
  const [cartLoading, setCartLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      setCartLoading(true);

      if (currentUser && userData?.cart) {
        setCart(userData.cart);
      }
      setCartLoading(false);
    };

    fetchCartItems();
  }, [currentUser, userData]);

  const cartProductsNumber = () => {
    let products = 0;
    cart.forEach((product) => {
      products += product.quantity;
    });

    return products;
  };

  const cartTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    return totalPrice;
  };

  const addToCart = async (productToAdd) => {
    if (currentUser) {
      // Update the cart array with the newly added product
      try {
        if (productToAdd.stock === 0) {
          return Promise.reject(new Error("Product is out of stock"));
        }
        // Check if the added product is found inside the cart
        const existingProduct = cart.find(
          (product) => product.id === productToAdd.id
        );

        // Create new cart state
        let updatedCart;
        // If the product is already in the cart - add +1 to it's quantity
        if (existingProduct) {
          updatedCart = cart.map((product) =>
            product.id === productToAdd.id
              ? { ...product, quantity: product.quantity + 1 }
              : product
          );
        } else {
          // If the product is not in the cart yet - add it with quantity of 1
          updatedCart = [...cart, { ...productToAdd, quantity: 1 }];
        }

        // Update cart state, userData state and userData local storage object
        const updatedUserData = { ...userData, cart: updatedCart };
        // setUserData((prevUserData) => ({
        //   ...prevUserData,
        //   cart: updatedCart,
        // }));
        // localStorage.setItem("userData", JSON.stringify(updatedUserData));
        updateUserData(updatedUserData);
        setCart(updatedCart);

        // Update user's cart in firestore
        await updateDoc(userDocRef, {
          cart: updatedCart,
        });
      } catch (error) {
        console.log("Error while adding product to the cart: ", error);
        throw new Error(
          "Failed to add product to the cart. Please contant support"
        );
      }
    }
  };

  const removeFromCart = async (productToRemove) => {
    try {
      // Check if the added product is found inside the cart
      const existingProduct = cart.find(
        (product) => product.id === productToRemove.id
      );

      // If the product is found in the cart - check the quantity
      if (existingProduct) {
        let updatedCart;
        // // If the quantity is larger than 1 - decrease it by 1
        // if (existingProduct.quantity > 1) {
        //   updatedCart = cart.map((product) =>
        //     product.id === productToRemove.id
        //       ? { ...product, quantity: product.quantity - 1 }
        //       : product
        //   );
        // } else {
        //   updatedCart = cart.filter(
        //     (product) => product.id !== productToRemove.id
        //   );
        // }
        updatedCart = cart.filter(
          (product) => product.id !== productToRemove.id
        );

        // Update cart state, userData state and userData local storage object
        const updatedUserData = { ...userData, cart: updatedCart };
        // setUserData((prevUserData) => ({
        //   ...prevUserData,
        //   cart: updatedCart,
        // }));
        // localStorage.setItem("userData", JSON.stringify(updatedUserData));
        updateUserData(updatedUserData);
        setCart(updatedCart);

        // Update user's cart in firestore
        await updateDoc(userDocRef, {
          cart: updatedCart,
        });
      }
    } catch (error) {
      console.log("Error while removing product from the cart: ", error);
      throw new Error(
        "Failed to remove product from the cart. Please contant support"
      );
    }
  };

  const changeQuantity = (productId, newQuantity) => {
    // Throw errors if received below minimal or above maximal quantity
    if (newQuantity < 1) {
      return Promise.reject(new Error("Minimal quantity per product is 1"));
    }
    if (newQuantity > 100) {
      return Promise.reject(new Error("Maximal quantity per product is 100"));
    }

    // Set the new cart and change the quantity of the product
    const updatedCart = cart.map((product) =>
      product.id === productId ? { ...product, quantity: newQuantity } : product
    );

    // Update user's cart in firestore
    return updateDoc(userDocRef, {
      cart: updatedCart,
    })
      .then(() => {
        setCart(updatedCart);
      })
      .catch((error) => {
        console.log("Error changing product quantity: ", error);
        throw new Error(
          "Failed to change product's quantity. Please contact support"
        );
      });
  };

  const globalVal = {
    cartLoading,
    cart,
    setCart,
    cartProductsNumber,
    cartTotalPrice,
    addToCart,
    removeFromCart,
    changeQuantity,
  };

  return (
    <CartContext.Provider value={globalVal}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
