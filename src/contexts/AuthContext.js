import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { auth, googleProvider } from "../firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { usersRef, ordersRef } from "../firebase/firestore";
import { doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";
import { useValidationContext } from "./ValidationContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { validateEmail, validatePassword, validateName, displayNameTaken } =
    useValidationContext();
  const [userLoading, setUserLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  // const [userData, setUserData] = useState(null);
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem("userData");
    return savedData ? JSON.parse(savedData) : null;
  });
  const [userDocRef, setUserDocRef] = useState(null);

  // Callback to update the current user's orders (used each change in current user)
  const updateCurrentUserOrders = useCallback(
    (docRef) => {
      // Do not attempt if no currentUser
      if (!currentUser) {
        return;
      }

      // Get all order docs from orders collection
      getDocs(ordersRef)
        .then((orders) => {
          // Initiate an orders array
          const userOrders = [];

          // Go over all orders and add ones that belong to the current user
          orders.forEach((doc) => {
            const orderData = doc.data();
            if (orderData.customer.userId === currentUser.uid) {
              userOrders.push({ ...orderData });
            }
          });

          // Update the user's document with the found orders in firestore
          return updateDoc(docRef, { orders: userOrders }).then(() => {
            // Update user data if the currentUser matches
            updateUserData({ orders: userOrders });
          });
        })
        .catch((error) => {
          console.log("Error updating current user's orders: ", error);
        });
    },
    [currentUser]
  );

  useEffect(() => {
    // Use a listener to change the current user and user document
    const removeAuthListener = onAuthStateChanged(auth, (user) => {
      setUserLoading(true);

      if (user) {
        setCurrentUser(user);

        const docRef = doc(usersRef, user.uid);

        getDoc(docRef)
          .then((userDoc) => {
            // Create a document for the user (Will not create if the document already exists)
            return createUserDocument(user)
              .then(() => {
                // Set the user doc ref state
                setUserDocRef(docRef);

                // Update user data (Local state and local storage object)
                const data = userDoc.data();
                updateUserData({ ...data, uid: userDoc.id });

                // Update the user's orders array (in case orders were changed by admins)
                return updateCurrentUserOrders(docRef);
              })
              .catch((error) => {
                console.log("Error updating user data: ", error);
              });
          })
          .catch((error) => {
            console.log("Error fetching user data: ", error);
          })
          .finally(() => {
            setUserLoading(false);
          });
      } else {
        setCurrentUser(null);
        setUserData(null);
        setUserDocRef(null);
        localStorage.removeItem("userData");
        setUserLoading(false);
      }
    });

    // Return the listener to remove it and avoid reuses
    return () => removeAuthListener();
  }, [updateCurrentUserOrders]);

  // Method to get a user's data by UID
  const getUserByUid = (uid) => {
    const userDocRef = getUserDocRefByUid(uid);
    return getDoc(userDocRef)
      .then((userDoc) => {
        if (userDoc.exists()) {
          return userDoc.data();
        } else {
          throw new Error("User not found");
        }
      })
      .catch((error) => {
        console.log(`Error fetching user ID ${uid}: `, error);
      });
  };

  // Method to get a user's doc ref by uid
  const getUserDocRefByUid = (uid) => {
    const userRef = doc(usersRef, uid);

    return userRef;
  };

  // Method to update the userData state and local storage object after making changes (cart, orders, wishlist, last sign-in time etc...)
  const updateUserData = (newData) => {
    setUserData((prevData) => {
      const updatedData = { ...prevData, ...newData };
      localStorage.setItem("userData", JSON.stringify(updatedData));

      return updatedData;
    });
  };

  // Method to create a new user document
  const createUserDocument = async (user) => {
    // Get the user's doc
    const docRef = doc(usersRef, user.uid);
    const userDoc = await getDoc(docRef);

    // If user document doesn't exist - create new document for the user
    if (!userDoc.exists()) {
      // Current time string for lastSignInTime
      const now = new Date();
      const currentDateTimeString = `${now.toDateString()} ${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      // User data for the the doc
      const data = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL || "",
        isAdmin: false,
        cart: [],
        orders: [],
        lastSignInTime: currentDateTimeString,
      };

      // Set/Create the new doc and set the current doc ref
      await setDoc(docRef, data);
      setUserDocRef(docRef);
    }
  };

  // Method to update the user's last sign-in time
  const updateLastSignInTime = (user) => {
    // Current date and time string
    const now = new Date();
    const currentDateTimeString = `${now.toDateString()} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    // Get the user's doc ref
    const userDocRef = doc(usersRef, user.uid);

    // Update the lastSignInTime field with the current date and time string
    return updateDoc(userDocRef, {
      lastSignInTime: currentDateTimeString,
    })
      .then(() => {
        // Update the local userData with new sign-in time
        updateUserData({ ...userData, lastSignInTime: currentDateTimeString });
      })
      .catch((error) => {
        console.log("Failed to update user's last sign-in time: ", error);
      });
  };

  // Login method
  const login = (email, password) => {
    // Validations:
    // Throws error if empty email field or invalid email format
    if (!email || email === "") {
      return Promise.reject(new Error("Please fill in your email"));
    }
    if (!validateEmail(email)) {
      return Promise.reject(new Error("Invalid email format"));
    }

    // Return user credentials for logging in
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;

        // Check email verification or designated global admin user
        if (email === "ckadmin@camerakingdom.com" || user.emailVerified) {
          // Update user's last sign-in time
          updateLastSignInTime(user);
          // Return the user credentials if login succeeded
          return userCredentials;
        } else {
          return sendEmailVerification(user)
            .then(() => {
              logout();
              return Promise.reject(
                new Error(
                  "Email verification required. Verification email sent. Please check your inbox"
                )
              );
            })
            .catch((verificationError) => {
              logout();
              // If too many verification requests
              if (verificationError.code === "auth/too-many-requests") {
                return Promise.reject(
                  new Error(
                    "Email verification required. A verification email has already been sent. Please check your inbox"
                  )
                );
              } else if (verificationError.message.includes("required")) {
                // Catching email verification sent error
                return Promise.reject(new Error(verificationError.message));
              } else {
                // If sending verification email failed
                console.log(verificationError.code);
                console.log(verificationError);
                return Promise.reject(
                  new Error(
                    "Error sending verification email. Please check your inbox or contact support"
                  )
                );
              }
            });
        }
      })
      .catch((error) => {
        // Handle firebase errors
        if (error.code === "auth/user-not-found") {
          throw new Error("User with the provided email not found");
        } else if (error.code === "auth/missing-password") {
          throw new Error("Please fill in the password");
        } else if (error.code === "auth/wrong-password") {
          throw new Error("Incorrect password");
        } else if (error.message.includes("verification")) {
          throw new Error(error.message);
        } else {
          console.log("Login failed: ", error);
          throw new Error("Login failed. Please try again or contact support");
        }
      });
  };

  // Google login method
  const googleLogin = async () => {
    // Attempt to login and get the user data
    const googleUserData = await signInWithPopup(auth, googleProvider);

    // Create a document for the user
    await createUserDocument(googleUserData.user);

    // Update user's last sign-in time
    updateLastSignInTime(googleUserData.user);

    // Return the user data if login succeeded
    return googleUserData;
  };

  // Registration method
  const register = (name, email, password, repeatPassword) => {
    // Validations:
    // Throws error if display name is empty
    if (!validateName(name)) {
      return Promise.reject(new Error("Display name cannot be empty"));
    }
    return displayNameTaken(name)
      .then((displayNameTaken) => {
        // Throws error if display name is taken
        if (displayNameTaken) {
          return Promise.reject(new Error("Display name is already taken"));
        }
        // Throws error if empty email or invalid email format
        if (!email || email.trim() === "") {
          return Promise.reject(new Error("Please fill in your email"));
        }
        if (!validateEmail(email)) {
          return Promise.reject(new Error("Invalid email format"));
        }
        // Throws error if empty or invalid password format
        if (!password || password.trim() === "") {
          return Promise.reject(new Error("Please fill in the password"));
        }
        if (!validatePassword(password)) {
          return Promise.reject(
            new Error(
              "Password must be at least 8 characters long, include a number, a symbol, and a capital letter."
            )
          );
        }
        // Throws error if empty or invalid repeat password
        if (repeatPassword.trim() === "") {
          return Promise.reject(new Error("Please repeat your password"));
        }
        if (password.trim() !== repeatPassword.trim()) {
          return Promise.reject(new Error("Passwords do not match"));
        }

        // Create user
        return createUserWithEmailAndPassword(auth, email, password);
      })
      .then((newUserData) => {
        // Update the display name for the user
        return updateProfile(newUserData.user, {
          displayName: name,
        })
          .then(() => {
            // Set the docRef to the new user
            return setUserDocRef(newUserData.user);
          })
          .then(() => {
            // Create a new document for the new user
            return createUserDocument(newUserData.user);
          })
          .then(() => {
            // Return the new user data
            return newUserData;
          });
      })
      .catch((error) => {
        // Handle firebase errors
        if (error.code === "auth/email-already-in-use") {
          return Promise.reject(
            new Error("User with this email already exists")
          );
        } else {
          console.log("Registration failed: ", error);
          return Promise.reject(
            new Error(
              "Registration failed. Please try again or contact support"
            )
          );
        }
      });
  };

  // Logout method
  const logout = () => {
    return signOut(auth)
      .then(() => {
        // Make sure all user data is cleared after logging out
        setCurrentUser(null);
        setUserData(null);
        setUserDocRef(null);
        localStorage.removeItem("userData");
      })
      .catch((error) => {
        console.log("Error logging out: ", error);
        throw new Error(
          "Failed to log out. Please try again or contact support"
        );
      });
  };

  const globalVal = {
    userLoading,
    currentUser,
    userData,
    userDocRef,
    updateUserData,
    getUserByUid,
    getUserDocRefByUid,
    login,
    googleLogin,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={globalVal}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
