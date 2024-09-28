import { useRoutes } from "react-router-dom";
import DashboardOverview1 from "../pages/DashboardOverview1";
import AddProduct from "../pages/AddProduct";
import ProjectApproved from "../pages/ProjectApproved"
import Chat from "../pages/Chat";
import Calendar from "../pages/Clients";

import UsersLayout2 from "../pages/UsersLayout2";
import ProfileOverview3 from "../pages/ProfileOverview3";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import UpdateProfile from "../pages/UpdateProfile";
import Notification from "../pages/Notification";
import Accordion from "../pages/Accordion";
import ProgressBar from "../pages/ProgressBar";
import Icon from "../pages/Icon";
import LoadingIcon from "../pages/LoadingIcon";
import WysiwygEditor from "../pages/WysiwygEditor";
import Chart from "../pages/Chart";
import ForgotPassword from "../pages/ForgotPassword";
import {  Navigate } from "react-router-dom";
import OTP from "../pages/OTP";
import NewPassword from "../pages/NewPassword";
import { jwtDecode } from "jwt-decode";
import { useEffect,useState } from "react";
import Layout from "../themes";
import Clients from "../pages/Clients";
import ProjectList from "../pages/ProductList";
import ProductList from "../pages/ProductList";

interface DecodedToken {
  role: string; // Expecting a string role from the JWT token
}

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
  
};

function Router() {

  const [role, setRole] = useState<string>("");

   // Decode JWT to check if the user is an admin
   useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setRole(decoded.role); // Set role directly based on decoded token
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const routes = [
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/",
          element: <DashboardOverview1 />,
        },
        
        {
          path: "add-product",
          element: <AddProduct />,
        },
        {
          path: "project-approved",
          element: <ProjectApproved />,
        },
        {
          path: "product-list",
          element: <ProductList />,
        },
           
              
        {
          path: "chat",
          element: <Chat />,
        },
       
        {
          path: "clients",
          element: <Clients />,
        },
     
        {
          path: "users-layout-2",
          element: <UsersLayout2 />,
        },
       
       
        {
          path: "profile-overview-3",
          element: <ProfileOverview3 />,
        },
        {
          path: "update-profile",
          element: <UpdateProfile />,
        },
        
        {
          path: "notification",
          element: <Notification />,
        },
        
        {
          path: "accordion",
          element: <Accordion />,
        },
        
        {
          path: "progress-bar",
          element: <ProgressBar />,
        },
        
        {
          path: "icon",
          element: <Icon />,
        },
        {
          path: "loading-icon",
          element: <LoadingIcon />,
        },
       
        
        {
          path: "wysiwyg-editor",
          element: <WysiwygEditor />,
        },
        
        {
          path: "chart",
          element: <Chart />,
        },
       
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,  // Public route for Forgot Password
    },
    {
      path: "/otp",
      element: <OTP />,  // Public route for Forgot Password
    },
    {
      path: "/resetpassword/:token",
      element: <NewPassword />,  // Public route for Forgot Password
    },
    {
      path: "/error-page",
      element: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
