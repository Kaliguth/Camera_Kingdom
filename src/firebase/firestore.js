import firebaseApp from "./config";
import { getFirestore, collection } from "firebase/firestore";


// Initialize Firestore
const db = getFirestore(firebaseApp);

// Create collection references
const productsRef = collection(db, "products");
const usersRef = collection(db, "users");
const ordersRef = collection(db, "orders");
const messagesRef = collection(db, "messages");
const couponsRef = collection(db, "coupons");

export { db, productsRef, usersRef, ordersRef, messagesRef, couponsRef };