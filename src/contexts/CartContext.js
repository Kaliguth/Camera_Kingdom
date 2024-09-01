import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { updateDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser, userData, userDocRef } = useAuthContext();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (currentUser && userData?.cart) {
        setCart(userData.cart);
      }
    };

    fetchCartItems();
  }, [currentUser, userData]);

  const addToCart = async (productToAdd) => {
    if (currentUser) {
      // Update the cart array with the newly added product
      try {
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

        setCart(updatedCart);

        // Update user's cart in firestore
        await updateDoc(userDocRef, {
          cart: updatedCart,
        });
      } catch (error) {
        alert("Failed to add product to the cart", error);
      }
    }
  };

  const removeFromCart = async (productToRemove) => {
    if (currentUser) {
      try {
        // Check if the added product is found inside the cart
        const existingProduct = cart.find(
          (product) => product.id === productToRemove.id
        );

        // If the product is found in the cart - check the quantity
        if (existingProduct) {
          let updatedCart;
          // If the quantity is larger than 1 - decrease it by 1
          if (existingProduct.quantity > 1) {
            updatedCart = cart.map((product) =>
              product.id === productToRemove.id
                ? { ...product, quantity: product.quantity - 1 }
                : product
            );
          } else {
            updatedCart = cart.filter(
              (product) => product.id !== productToRemove.id
            );
          }

          setCart(updatedCart);

          // Update user's cart in firestore
          await updateDoc(userDocRef, {
            cart: updatedCart,
          });
        }
      } catch (error) {
        alert("Failed to remove product from the cart", error);
      }
    }
  };

  const completeOrder= () => {
    
  }

  const globalVal = {
    cart,
    addToCart,
    removeFromCart,
  };

  return (
    <CartContext.Provider value={globalVal}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
