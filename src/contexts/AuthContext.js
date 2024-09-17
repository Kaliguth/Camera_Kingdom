import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
} from "firebase/auth";
import { usersRef } from "../firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDocRef, setUserDocRef] = useState(null);

  useEffect(() => {
    // Use a listener to change the current user and user document
    const removeAuthListener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const docRef = doc(usersRef, user.uid);
        setUserDocRef(docRef);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        setUserDocRef(null);
      }
    });

    // Return the listener to remove it and avoid reuses
    return () => removeAuthListener();
  }, []);

  // Method to create a new user document
  const createUserDocument = async (user) => {
    const docRef = doc(usersRef, user.uid);
    const userDoc = await getDoc(docRef);

    if (!userDoc.exists()) {
      // If user document doesn't exist - create new document for the user
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName,
        cart: [],
        orders: [],
      });
    }
  };

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
  const validateDisplayName = (name) => {
    // Can't be empty
    return name.trim().length > 0;
  };

  // Login method
  const login = async (email, password) => {
    // Validations:
    // Throws error if invalid email format
    if (!validateEmail(email)) {
      throw new Error("Invalid email format.");
    }
    // Throws error if invalid password format
    if (!validatePassword(password)) {
      throw new Error(
        "Password must be at least 8 characters, include a number, a symbol, and a capital letter."
      );
    }

    // Return user credentials for logging in
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Google login method
  const googleLogin = async () => {
    const googleUserData = await signInWithPopup(auth, googleProvider);
    await createUserDocument(googleUserData.user);
    return googleUserData;
  };

  // Registration method
  const register = async (name, email, password) => {
    /* Todo:
    (צד לקוח)
    Add input field for password (אימות)                 COMPLETE ME
    */
    // Validations:
    // Throws error if display name is empty
    if (!validateDisplayName(name)) {
      throw new Error("Display name cannot be empty.");
    }
    // Throws error if invalid email format
    if (!validateEmail(email)) {
      throw new Error("Invalid email format.");
    }
    // Throws error if invalid password format
    if (!validatePassword(password)) {
      throw new Error(
        "Password must be at least 8 characters, include a number, a symbol, and a capital letter."
      );
    }

    // Collect all user data
    const newUserData = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Add the display name into the user data
    await updateProfile(newUserData.user, {
      displayName: name,
    });
    // Create a new user document with all user data
    await createUserDocument(newUserData.user);

    // Return user data for registration
    return newUserData;
  };

  // Logout method
  const logout = async () => {
    return await signOut(auth);
  };

  // Update method for update profile page
  const update = async (user, { displayName, email, photoURL }) => {
    const dataToUpdate = {};

    if (displayName) {
      dataToUpdate.displayName = displayName;
    }

    if (photoURL !== undefined) {
      dataToUpdate.photoURL = photoURL;
    }

    // Update user profile only if there is data to update
    if (Object.keys(dataToUpdate).length > 0) {
      await updateProfile(user, dataToUpdate);
    }

    if (email) {
      await updateEmail(user, email);
      dataToUpdate.email = email;
    }

    const userDocRef = doc(usersRef, user.uid);
    await setDoc(userDocRef, dataToUpdate, { merge: true });
  };

  const globalVal = {
    currentUser,
    userData,
    userDocRef,
    login,
    googleLogin,
    register,
    logout,
    update,
  };

  return (
    <AuthContext.Provider value={globalVal}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
