import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import AllProviders from "./contexts/AllProviders";
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
import AdminDashboard from "./pages/AdminDashboard";
import UserManagementPage from "./pages/UserManagementPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import ProductManagement from "./components/ProductManagement";
import OrderManagement from "./components/OrderManagement";
import Error404Page from "./pages/Error404Page";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import EditProductsPage from "./pages/EditProductsPage";

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
      <AllProviders>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route
                path="categories/:category"
                element={<CategoryProductsPage />}
              />
              <Route path="contact-us" element={<ContactUsPage />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route
                path="order-summary/:orderId"
                element={<OrderSummaryPage />}
              />
              <Route path="login" element={<LoginRegisterPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="product/:id" element={<ProductDetailsPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin-dashboard/users"
                element={<UserManagementPage />}
              />
              <Route
                path="/admin-dashboard/products"
                element={<ProductManagementPage />}
              >
                <Route
                  path="edit"
                  element={<EditProductsPage />}
                />
              </Route>
              <Route
                path="/admin-dashboard/orders"
                element={<OrderManagement />}
              />
              <Route path="*" element={<Error404Page />} />
            </Route>
          </Routes>
        </Router>
      </AllProviders>
    </div>
  );
}

export default App;
