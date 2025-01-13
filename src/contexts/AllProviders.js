// Component to group all context providers for App.js
import React from "react";
import { ValidationProvider } from "./ValidationContext";
import { AuthProvider } from "./AuthContext";
import { ProductProvider } from "./ProductContext";
import { WishlistProvider } from "./WishlistContext";
import { CartProvider } from "./CartContext";
import { PurchaseProvider } from "./PurchaseContext";
import { UserManagementProvider } from "./UserManagementContext";
import { OrderManagementProvider } from "./OrderManagementContext";
import { MessagesManagementProvider } from "./MessagesManagementContext";

const AllProviders = ({ children }) => {
  return (
    <ValidationProvider>
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderManagementProvider>
                <PurchaseProvider>
                  <UserManagementProvider>
                    <MessagesManagementProvider>
                      {children}
                    </MessagesManagementProvider>
                  </UserManagementProvider>
                </PurchaseProvider>
              </OrderManagementProvider>
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </ValidationProvider>
  );
};

export default AllProviders;
