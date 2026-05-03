import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";
import Menu from "../pages/Menu/Menu/Menu";
import Order from "../pages/Order/Order/Order";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Signup/SignUp";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Layout/Dashboard";
import Cart from "../pages/Dashboard/cart/Cart";
import NotFoundPage from "../pages/NotFoundPage";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import History from "../pages/History/History";
import AdminRoute from "./AdminRoute";
import AddItems from "../pages/Dashboard/AddItems/AddItems";
import AdminHome from "../pages/Dashboard/AdminHome/AdminHome";
import ManageItems from "../pages/Dashboard/ManageItems/ManageItems";
import UpdateItem from "../pages/Dashboard/UpdateItem/UpdateItem";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import UserHome from "../pages/Dashboard/UserHome/UserHome";
import Inventory from "../pages/Inventory/Inventory";
import Kitchen from "../pages/Kitchen/Kitchen";
import PurchaseOrder from "../pages/PurchaseOrder/PurchaseOrder";
import StaffManagement from "../pages/StaffManagement/StaffManagement";
import Supplier from "../pages/Supplier/Supplier";
import Review from "../pages/Dashboard/Review/Review";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "menu", element: <Menu /> },

      { path: "inventory", element: <Inventory /> },
      { path: "kitchen", element: <Kitchen /> },
      { path: "purchase-orders", element: <PurchaseOrder /> },
      { path: "staff", element: <StaffManagement /> },
      { path: "suppliers", element: <Supplier /> },

      {
        path: "order/:category",
        element: (
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        )
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> }
    ]
  },

  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      { path: "cart", element: <Cart /> },
      { path: "userHome", element: <UserHome /> },
      { path: "payment", element: <Payment /> },
      { path: "checkout", element: <Payment /> },
      { path: "paymentHistory", element: <PaymentHistory /> },
      { path: "review", element: <Review /> },

      // admin only routes
      {
        path: "adminHome",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        )
      },
      {
        path: "users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        )
      },
      {
        path: "addItems",
        element: (
          <AdminRoute>
            <AddItems />
          </AdminRoute>
        )
      },
      {
        path: "manageItems",
        element: (
          <AdminRoute>
            <ManageItems />
          </AdminRoute>
        )
      },
      {
        path: "updateItem/:id",
        element: (
          <AdminRoute>
            <UpdateItem />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(`http://localhost:8000/menu/${params.id}`)
      },

      { path: "history", element: <History /> },

      {
        path: "inventory",
        element: (
          <AdminRoute>
            <Inventory />
          </AdminRoute>
        )
      },
      {
        path: "kitchen",
        element: (
          <AdminRoute>
            <Kitchen />
          </AdminRoute>
        )
      },
      {
        path: "purchase-orders",
        element: (
          <AdminRoute>
            <PurchaseOrder />
          </AdminRoute>
        )
      },
      {
        path: "staff",
        element: (
          <AdminRoute>
            <StaffManagement />
          </AdminRoute>
        )
      },
      {
        path: "suppliers",
        element: (
          <AdminRoute>
            <Supplier />
          </AdminRoute>
        )
      }
    ]
  }
]);