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

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = async () => {
    const googleUserData = await signInWithPopup(auth, googleProvider);
    await createUserDocument(googleUserData.user);
    return googleUserData;
  };

  const register = async (name, email, password) => {
    const newUserData = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(newUserData.user, {
      displayName: name,
    });
    await createUserDocument(newUserData.user);

    return newUserData;
  };

  const logout = async () => {
    return await signOut(auth);
  };

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
