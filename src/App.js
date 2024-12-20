import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { ValidationProvider } from "./contexts/ValidationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import { PurchaseProvider } from "./contexts/PurchaseContext";
import { ToastContainer, Slide } from "react-toastify";
import Header from "./components/layouts/Header";
import ScrollToTop from "./components/utility/ScrollToTop";
import Footer from "./components/layouts/Footer";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AbousUsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserManagement from "./components/UserManagement";
import ProductManagement from "./components/ProductManagement";
import OrderManagement from "./components/OrderManagement";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { WishlistProvider } from "./contexts/WishlistContext";

// Layout Component to contain all layour components
const Layout = () => (
  <>
    <Header />
    <ScrollToTop />
    <Outlet />
    <Footer />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      draggable
      theme="light"
      transition={Slide}
    />
  </>
);

function App() {
  return (
    <div className="App">
      <ValidationProvider>
        <AuthProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <PurchaseProvider>
                  <Router>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route
                          path="categories/:category"
                          element={<CategoryProductsPage />}
                        />
                        <Route path="contactus" element={<ContactUsPage />} />
                        <Route path="aboutus" element={<AboutUsPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="ordersummary/:ordernumber" element={<OrderSummaryPage />} />
                        <Route path="login" element={<LoginRegisterPage />} />
                        <Route path="wishlist" element={<WishlistPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route
                          path="product/:id"
                          element={<ProductDetailsPage />}
                        />
                        <Route path="/manager" element={<ManagerDashboard />} />
                        <Route
                          path="/manager/users"
                          element={<UserManagement />}
                        />
                        <Route
                          path="/manager/products"
                          element={<ProductManagement />}
                        />
                        <Route
                          path="/manager/orders"
                          element={<OrderManagement />}
                        />
                      </Route>
                    </Routes>
                  </Router>
                </PurchaseProvider>
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </AuthProvider>
      </ValidationProvider>
    </div>
  );
}

export default App;
