import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { usersRef } from "../firebase/firestore";
import { deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

const UserManagementContext = createContext();

export const UserManagementProvider = ({ children }) => {
  const { currentUser, updateUserData } = useAuthContext();
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

  const globalVal = {
    allUsers,
    usersLoading,
    updateUserRole,
    deleteUser,
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
