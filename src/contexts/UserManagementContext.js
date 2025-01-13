import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { useValidationContext } from "./ValidationContext";
import { usersRef } from "../firebase/firestore";
import { deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { auth } from "../firebase/auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const UserManagementContext = createContext();

export const UserManagementProvider = ({ children }) => {
  const { currentUser, updateUserData, getUserDocRefByUid } = useAuthContext();
  const { validateName, displayNameTaken, validatePassword } =
    useValidationContext();
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    // Fetch all users from Firestore
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const usersCollection = await getDocs(usersRef);
        setAllUsers(
          usersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
      setUsersLoading(false);
    };

    fetchUsers();
  }, []);

  // Method to update the admin status of a user with given ID
  const updateUserRole = (userId) => {
    // Find the user to be updated
    const userToUpdate = allUsers.find((user) => user.id === userId);

    // Attemp update only if user is found
    if (userToUpdate) {
      // Change the user's isAdmin state to the opposite
      const updatedUser = { ...userToUpdate, isAdmin: !userToUpdate.isAdmin };

      // Get the user's doc reference
      const userRef = doc(usersRef, userId);

      // Update the user's doc inside the collection with the new state
      updateDoc(userRef, { isAdmin: updatedUser.isAdmin })
        .then(() => {
          // Update the users array with the new updated user
          setAllUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? updatedUser : user))
          );

          // If the updated user is the currently logged in user,
          // update the userData state and local storage object
          if (updatedUser.id === currentUser.uid) {
            updateUserData(updatedUser);
          }
        })
        .catch((error) => {
          console.log("Error updating user role: ", error);
          throw new Error("Failed to update the user's role");
        });
    } else {
      // If user was not found in the database
      console.log("User to update not found");
      throw new Error("Failed to find the user in the database");
    }
  };

  // Method to delete a user with given ID
  const deleteUser = (userIdToDelete) => {
    // Find the user to be deleted
    const userToDelete = allUsers.find((user) => user.id === userIdToDelete);

    // Attemp deletion only if user is found
    if (userToDelete) {
      // Get the user's doc reference
      const userDocRef = doc(usersRef, userIdToDelete);

      // Delete the user's doc
      deleteDoc(userDocRef)
        .then(() => {
          // Update the users array after deleting the user
          setAllUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userIdToDelete)
          );
        })
        .catch((error) => {
          console.log("Error deleting user: ", error);
          throw new Error("Failed to delete the user");
        });
    } else {
      // If user was not found in the database
      console.log("User to delete not found");
      throw new Error("Failed to find the user in the database");
    }
  };

  // Update method for update a user's profile picture and display name (through profile page)
  const updateUserProfile = (userToUpdate, photoURL, displayName) => {
    // Validations:
    // Throws error if displayName is empty
    if (!displayName || !validateName(displayName)) {
      return Promise.reject(new Error("Please fill in your display name"));
    }
    return displayNameTaken(displayName)
      .then((displayNameTaken) => {
        // Throws error if display name is not the same and is taken
        if (displayName !== userToUpdate.displayName && displayNameTaken) {
          return Promise.reject(new Error("Display name is already taken"));
        }

        // Get the user's doc reference
        const userDocRef = getUserDocRefByUid(userToUpdate.id);

        // Update the user's doc with the new photoURL and display name
        return updateDoc(userDocRef, { photoURL, displayName });
      })
      .then(() => {
        // Update allUsers array with the updated user
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userToUpdate.id
              ? { ...user, photoURL, displayName }
              : user
          )
        );

        // If the updated user is the currently logged in user,
        // update the userData state and local storage object
        // (In case this method will be used on other users as well in the future)
        if (userToUpdate.id === currentUser.uid) {
          updateUserData({ photoURL, displayName });
        }
      })
      .catch((error) => {
        // Handle display name taken error
        if (error.message === "Display name is already taken") {
          console.log(error);
          throw error;
        }

        console.log(
          `Error updating user ID ${userToUpdate.id} profile:`,
          error
        );
        throw new Error(
          "Failed to update your user profile. Please try again or contact support"
        );
      });
  };

  const changeUserPassword = (userToUpdate, currentPassword, newPassword) => {
    // Validations:
    // Throws error if currentPassword is empty
    if (!currentPassword || currentPassword.trim() === "") {
      return Promise.reject(new Error("Please fill in your current password"));
    }
    // Throws error if newPassword is empty or invalid
    if (!newPassword || newPassword.trim() === "") {
      return Promise.reject(new Error("Please fill in the new password"));
    }
    if (!validatePassword(newPassword)) {
      return Promise.reject(
        new Error(
          "New password must be at least 8 characters long, include a number, a symbol, and a capital letter"
        )
      );
    }

    // User's email for validation
    const { email } = userToUpdate;
    // Credentials object for validation
    const credential = EmailAuthProvider.credential(email, currentPassword);

    // Validate if email and currentPassword are correct
    return (
      reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
          // If validation is successful, update the password
          return updatePassword(auth.currentUser, newPassword);
        })
        // .then(() => {
        //   console.log("Password updated successfully");
        // })
        .catch((error) => {
          console.log("Error changing password: ", error);

          // Handle different errors
          if (error.code === "auth/wrong-password") {
            throw new Error("The current password is incorrect");
          } else if (error.code === "auth/weak-password") {
            throw new Error("The new password is too weak. Please choose a stronger password");
          } else {
            throw new Error(
              "Failed to change your password. Please try again or contact support"
            );
          }
        })
    );
  };

  const globalVal = {
    allUsers,
    usersLoading,
    updateUserRole,
    deleteUser,
    updateUserProfile,
    changeUserPassword,
  };

  return (
    <UserManagementContext.Provider value={globalVal}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagementContext = () => {
  return useContext(UserManagementContext);
};
