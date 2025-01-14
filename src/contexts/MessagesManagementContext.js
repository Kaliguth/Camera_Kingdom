import React, { createContext, useContext, useState, useEffect } from "react";
import { useValidationContext } from "./ValidationContext";
import { messagesRef } from "../firebase/firestore";
import {
  addDoc,
  arrayUnion,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// Messages management context to store and provide methods
const MessagesManagementContext = createContext();

export const MessagesManagementProvider = ({ children }) => {
  const { validateEmail, validateName } = useValidationContext();
  const [allMessages, setAllMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Use effect to fetch all messages from firestore
  useEffect(() => {
    // Fetch all messages from Firestore
    const fetchMessages = async () => {
      setMessagesLoading(true);

      getDocs(messagesRef)
        .then((messagesCollection) => {
          const fetchedMessages = messagesCollection.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Set all messages with the fetched data
          setAllMessages(fetchedMessages);

          // Count unread messages to show in badge
          const unreadCount = fetchedMessages.filter(
            (message) => message.seenBy.length === 0
          );

          setUnreadMessages(unreadCount.length);
        })
        .catch((error) => {
          console.log("Error fetching messages: ", error);
        })
        .finally(() => {
          setMessagesLoading(false);
        });
    };

    fetchMessages();
  }, []);

  // Method to get a message document reference by id (for document changes)
  const getMessageDocRef = (id) => {
    const messageRef = doc(messagesRef, id);

    return messageRef;
  };

  // Method to add/send a message
  const addMessage = (newMessage) => {
    // Validations:
    // Throws error if name is empty
    if (!newMessage.name || !validateName(newMessage.name)) {
      return Promise.reject(new Error("Please fill in your name"));
    }
    // Throws error if email is empty or invalid
    if (!newMessage.email || newMessage.email.trim() === "") {
      return Promise.reject(new Error("Please fill in your email"));
    }
    if (!validateEmail(newMessage.email)) {
      return Promise.reject(new Error("Invalid email format"));
    }
    // Throws error if subject is empty
    if (!newMessage.subject || newMessage.subject.trim() === "") {
      return Promise.reject(new Error("Please fill in the subject"));
    }
    // Throws error if message is empty
    if (!newMessage.message || newMessage.subject.trim() === "") {
      return Promise.reject(new Error("Please enter a message"));
    }

    // Add the new message to Firestore
    return addDoc(messagesRef, newMessage)
      .then((messageRef) => {
        // Get the new message's document ID
        const messageId = messageRef.id;

        // Update allMessages list with the new message
        setAllMessages((prevMessages) => [
          ...prevMessages,
          { ...newMessage, id: messageId },
        ]);

        // Update unread messages counter
        setUnreadMessages((prevUnread) => prevUnread + 1);
      })
      .catch((error) => {
        console.log("Error sending new message: ", error);
        throw new Error("Failed to send the message. Please try again.");
      });
  };

  // Method to mark a message as answered
  const markMessageAnswered = (messageIdToMark) => {
    // Find the message to be marked
    const messageToMark = allMessages.find(
      (message) => message.id === messageIdToMark
    );

    // Attemp to mark only if message is found and is not answered
    if (messageToMark && !messageToMark.answered) {
      // Get the order's doc reference
      const messageDocRef = getMessageDocRef(messageIdToMark);

      // Mark message as answered in the order's doc
      updateDoc(messageDocRef, { answered: true })
        .then(() => {
          // Update the allMessages array after marking
          setAllMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.id === messageIdToMark
                ? { ...message, answered: true }
                : message
            )
          );
        })
        .catch((error) => {
          console.log(
            `Error marking order ID ${messageIdToMark} as answered: `,
            error
          );
          throw new Error("Failed to mark the order as answered");
        });
    } else {
      // If message was not found in the database
      console.log(
        "Message to mark was not found in the database or has already been marked"
      );
      throw new Error(
        "Failed to find the message in the database or the order has already been marked"
      );
    }
  };

  // Method to mark message as seen
  const markMessageSeen = (messageIdToMark, userName) => {
    // Find the message to be marked
    const messageToMark = allMessages.find(
      (message) => message.id === messageIdToMark
    );

    // Attemp to mark only if message is found
    if (messageToMark) {
      // Get the order's doc reference
      const messageDocRef = getMessageDocRef(messageIdToMark);

      // Mark message as seen by the user in the order's doc
      // (Only if it's the user's first time viewing the message)
      if (!messageToMark.seenBy.includes(userName)) {
        // Update the message's doc's seenBy array with the viewing user's name
        updateDoc(messageDocRef, { seenBy: arrayUnion(userName) })
          .then(() => {
            // Update the allMessages array after marking
            setAllMessages((prevMessages) =>
              prevMessages.map((message) =>
                message.id === messageIdToMark
                  ? { ...message, seenBy: arrayUnion(userName) }
                  : message
              )
            );

            // Update unread messages counter
            setUnreadMessages((prevUnread) => prevUnread - 1);
          })
          .catch((error) => {
            console.log(
              `Error marking order ID ${messageIdToMark} as seen by the user: `,
              error
            );
          });
      }
    } else {
      // If message was not found in the database
      console.log(
        "Message to mark was not found in the database or has already been marked seen by the user"
      );
    }
  };

  // Method to delete a message
  const deleteMessage = (messageIdToDelete) => {
    // Find the message to be deleted
    const messageToDelete = allMessages.find(
      (message) => message.id === messageIdToDelete
    );

    // Attemp deletion only if message is found and is answered and seen
    if (
      messageToDelete &&
      !messageToDelete.seenBy.length === 0 &&
      messageToDelete.answered
    ) {
      // Get the message's doc reference
      const messageDocRef = getMessageDocRef(messageIdToDelete);

      // Delete the message's doc
      deleteDoc(messageDocRef)
        .then(() => {
          // Update the allMessages array after deleting the message
          setAllMessages((prevMessages) =>
            prevMessages.filter((message) => message.id !== messageIdToDelete)
          );
        })
        .catch((error) => {
          console.log("Error deleting message: ", error);
          throw new Error("Failed to delete the message");
        });
    } else {
      // If order was not found in the database
      console.log("Order to delete not found");
      throw new Error("Failed to find the order in the database");
    }
  };

  const globalVal = {
    allMessages,
    messagesLoading,
    unreadMessages,
    addMessage,
    markMessageAnswered,
    markMessageSeen,
    deleteMessage,
  };

  return (
    <MessagesManagementContext.Provider value={globalVal}>
      {children}
    </MessagesManagementContext.Provider>
  );
};

export const useMessagesManagementContext = () => {
  return useContext(MessagesManagementContext);
};
