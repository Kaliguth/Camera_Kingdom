// Component to group all context providers for App.js
import React from "react";
import { ValidationProvider } from "./ValidationContext";
import { AuthProvider } from "./AuthContext";
import { ProductProvider } from "./ProductContext";
import { WishlistProvider } from "./WishlistContext";
import { CartProvider } from "./CartContext";
import { PurchaseProvider } from "./PurchaseContext";
import { UserManagementProvider } from "./UserManagementContext";

const AllProviders = ({ children }) => {
  return (
    <ValidationProvider>
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <PurchaseProvider>
                <UserManagementProvider>{children}</UserManagementProvider>
              </PurchaseProvider>
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </ValidationProvider>
  );
};

export default AllProviders;
