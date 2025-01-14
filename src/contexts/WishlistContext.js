import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { updateDoc } from "firebase/firestore";

// Wishlist context to store and provide methods
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser, userData, updateUserData, userDocRef } =
    useAuthContext();
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  // Use effect to fetch the user's wishlist items
  useEffect(() => {
    const fetchWishlistItems = async () => {
      setWishlistLoading(true);

      if (currentUser && userData?.wishlist) {
        setWishlist(userData.wishlist);
      }
      setWishlistLoading(false);
    };

    fetchWishlistItems();
  }, [currentUser, userData]);

  // Method to add a product to the wishlist
  const addToWishlist = async (productToAdd) => {
    // Update the wishlist array with the newly added product
    try {
      // Create new wishlist state
      const updatedWishlist = [...wishlist, { ...productToAdd }];

      // Update wishlist state, userData state and userData local storage object
      const updatedUserData = { ...userData, wishlist: updatedWishlist };
      updateUserData(updatedUserData);
      setWishlist(updatedWishlist);

      // Update user's wishlist in firestore
      await updateDoc(userDocRef, {
        wishlist: updatedWishlist,
      });
    } catch (error) {
      console.log("Error while adding product to the wishlist: ", error);
      throw new Error(
        "Failed to add product to the wishlist. Please try again or contant support"
      );
    }
  };

   // Method to remove a product from the wishlist
   const removeFromWishlist = async (productToRemove) => {
    try {
      // Check if the added product is found inside the wishlist
      const existingProduct = wishlist.find(
        (product) => product.id === productToRemove.id
      );

      // If the product was not found in the wishlist - throw an error
      if (!existingProduct) {
        return Promise.reject(
          new Error(
            "Failed to remove product from the wishlist. Please try again or contant support"
          )
        );
      }

      let updatedWishlist;
      updatedWishlist = wishlist.filter(
        (product) => product.id !== productToRemove.id
      );

      // Update wishlist state, userData state and userData local storage object
      const updatedUserData = { ...userData, wishlist: updatedWishlist };
      updateUserData(updatedUserData);
      setWishlist(updatedWishlist);

      // Update user's wishlist in firestore
      await updateDoc(userDocRef, {
        wishlist: updatedWishlist,
      });
    } catch (error) {
      console.log("Error while removing product from the wishlist: ", error);
      throw new Error(
        "Failed to remove product from the wishlist. Please try again or contant support"
      );
    }
  };

  const globalVal = {
    wishlistLoading,
    wishlist,
    addToWishlist,
    removeFromWishlist,
  };

  return (
    <WishlistContext.Provider value={globalVal}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => useContext(WishlistContext);
