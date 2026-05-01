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


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement:<NotFoundPage></NotFoundPage>,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "menu",
        element: <Menu />
      },
      {
        path: "order/:category",
        element: <PrivateRoute><Order /></PrivateRoute>
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <SignUp />
      }
    ]
  },
  {
    path: "dashboard",
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "allusers",
        element: <AllUsers></AllUsers>
      },
      {
        path: "history",
        element: <History></History>
      }
      
    ]
  }
]);
