import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import AdminSales from "./pages/admin/AdminSales";
import AdminProduct from "./pages/admin/AdminProduct";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ShowUsersOrders from "./pages/admin/ShowUsersOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import OutOfStock from "./pages/admin/OutOfStock";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrder from "./pages/MyOrder";
import TrackOrder from "./pages/TrackOrder";
import StoreInfo from "./pages/StoreInfo";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar /> <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/verify",
    element: (
      <>
        <Verify />
      </>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <>
        <VerifyEmail />
      </>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <>
        <ProtectedRoute>
          <Navbar />
          <Profile />
          <Footer />
        </ProtectedRoute>
      </>
    ),
  },

  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Products />
        <Footer />
      </>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <>
        <Navbar />
        <SingleProduct />
        <Footer />
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <>
        <ProtectedRoute>
          <Navbar />
          <Cart />
          <Footer />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/address",
    element: (
      <>
        <ProtectedRoute>
          <AddressForm />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/order-success",
    element: (
      <>
        <ProtectedRoute>
          <OrderSuccess />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <Navbar />
        <MyOrder />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders/:orderId",
    element: (
      <ProtectedRoute>
        <Navbar />
        <TrackOrder />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp/:email",
    element: <VerifyOTP />,
  },
  {
    path: "/reset-password/:email",
    element: <ResetPassword />,
  },
  {
    path: "/faq",
    element: (
      <>
        <Navbar />
        <StoreInfo type="faq" />
        <Footer />
      </>
    ),
  },
  {
    path: "/shipping",
    element: (
      <>
        <Navbar />
        <StoreInfo type="shipping" />
        <Footer />
      </>
    ),
  },
  {
    path: "/size-guide",
    element: (
      <>
        <Navbar />
        <StoreInfo type="size" />
        <Footer />
      </>
    ),
  },
  {
    path: "/payment-methods",
    element: (
      <>
        <Navbar />
        <StoreInfo type="payment" />
        <Footer />
      </>
    ),
  },
  {
    path: "/refund-policy",
    element: (
      <>
        <Navbar />
        <StoreInfo type="refund" />
        <Footer />
      </>
    ),
  },
  {
    path: "/privacy",
    element: (
      <>
        <Navbar />
        <StoreInfo type="privacy" />
        <Footer />
      </>
    ),
  },
  {
    path: "/terms",
    element: (
      <>
        <Navbar />
        <StoreInfo type="terms" />
        <Footer />
      </>
    ),
  },
  {
    path: "/contact",
    element: (
      <>
        <Navbar />
        <Contact />
        <Footer />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Navbar />
        <About />
        <Footer />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <>
        <ProtectedRoute adminOnly={true}>
          <Navbar />
          <Dashboard />
        </ProtectedRoute>
      </>
    ),
    children: [
      {
        path: "sales",
        element: <AdminSales />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "out-of-stock",
        element: <OutOfStock />,
      },
      {
        path: "users/orders/:userId",
        element: <ShowUsersOrders />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "users/:id",
        element: <UserInfo />,
      },
    ],
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
