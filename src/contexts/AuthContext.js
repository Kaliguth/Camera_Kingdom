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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";

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
        // setUserDocRef(docRef);
        const userDoc = await getDoc(docRef);
        // console.log(userDoc.exists());

        if (userDoc.exists()) {
          setUserDocRef(docRef);
          setUserData(userDoc.data());
        } else {
          // await createUserDocument(user);
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
      const data = {email: user.email,
      displayName: user.displayName,
      isAdmin: false,
      cart: [],
      orders: [],
      };

      await setDoc(docRef, data);
      setUserDocRef(docRef);
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

  // // Find a user buy email
  // const findUserByEmail = (email) => {
  //   // Query to find users with the same email
  //   const q = query(usersRef, where("email", "==", email));

  //   // Get the documents from the query
  //   return getDocs(q)
  //     .then((querySnapshot) => {
  //       if (querySnapshot.empty) {
  //         // If the query does not include any documents (no users with the given email), return null
  //         return null;
  //       }

  //       // If a user with the same email is found (it is in the first index), fetch it
  //       const userDoc = querySnapshot.docs[0];
  //       // Return the user's data
  //       return userDoc.data();
  //     })
  //     .catch((error) => {
  //       throw new Error("Error querying user by email: " + error.message);
  //     });
  // };

  // Login method
  const login = async (email, password) => {
    // const user = await findUserByEmail(email);
    // console.log(user);
    // Validations:
    // Throws error if empty email field or invalid email format
    if (!email || email === "") {
      return Promise.reject(new Error("Please fill in your email"));
    }
    if (!validateEmail(email)) {
      return Promise.reject(new Error("Invalid email format"));
    }
    // if (!user) {
    //   return Promise.reject(new Error("User with given email not found"));
    // }

    // Throws error if empty password field or incorrect password
    // if (!password || password === "") {
    //   return Promise.reject(new Error("Please fill it your password"));
    // }

    // Return user credentials for logging in
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user);
      // Check email verification
      if (email === "ckadmin@camerakingdom.com" || user.emailVerified) {
        return userCredentials; // Return user credentials for success
      } else {
        const metadata = user.metadata;
        const lastSignInTime = new Date(metadata.lastSignInTime).getTime();
        const now = new Date().getTime();

        // Allow resending after 5 minutes
        const fiveMinutes = 60 * 5000;

        if (now - lastSignInTime > fiveMinutes) {
          return sendEmailVerification(user)
            .then(() => {
              throw new Error(
                "Email verification required. Verification email sent. Please check your inbox."
              );
            })
            .catch((verificationError) => {
              if (verificationError.code === "auth/too-many-requests") {
                throw new Error(
                  "Too many verification requests. Please try again later or contact support."
                );
              } else {
                throw new Error(
                  "An error occurred while sending the verification email. Please contact support."
                );
              }
            });
        } else {
          throw new Error(
            "Email verification required. A verification email has already been sent. Please check your inbox."
          );
        }
      }
    })
    .catch((error) => {
      // Handle different errors
      console.log(error.code);
      if (error.code === "auth/user-not-found") {
        throw new Error("User with the provided email not found");
      } else if (error.code === "auth/missing-password") {
        throw new Error("Please fill in the password");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password");
      } else {
        throw new Error(error.message || "Login failed. Please try again.");
      }
    });
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
      throw new Error("Display name cannot be empty");
    }
    // Throws error if invalid email format
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }
    // Throws error if empty or invalid password format
    if (password === "") {
      throw new Error("Please fill in the password");
    }
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
    console.log("user data:", newUserData);

    // Add the display name into the user data
    await updateProfile(newUserData.user, {
      displayName: name,
      photoURL: null,
    });
    console.log("Profile updated with display name:", name);
    // Create a new user document with all user data
    setUserDocRef(newUserData.user);
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
