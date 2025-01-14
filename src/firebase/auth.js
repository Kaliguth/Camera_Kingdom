import firebaseApp from "./config";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase auth provider

// Initialize Auth and google provider
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
