import { useRoutes } from "react-router-dom";
import DashboardOverview1 from "../pages/DashboardOverview1";
import AddProduct from "../pages/AddProduct";
import ProductDetails from "../pages/ProjectDetails";
import ProjectApproved from "../pages/ProjectApproved"
import Chat from "../pages/Chat";
import Calendar from "../pages/Clients";
import CrudDataList from "../pages/CrudDataList";
import CrudForm from "../pages/CrudForm";
import UsersLayout2 from "../pages/UsersLayout2";
import ProfileOverview3 from "../pages/ProfileOverview3";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import UpdateProfile from "../pages/UpdateProfile";
import ChangePassword from "../pages/ChangePassword";
import RegularTable from "../pages/RegularTable";
import Tabulator from "../pages/Tabulator";
import Modal from "../pages/Modal";
import Slideover from "../pages/Slideover";
import Notification from "../pages/Notification";
import Tab from "../pages/Tab";
import Accordion from "../pages/Accordion";
import Button from "../pages/Button";
import Alert from "../pages/Alert";
import ProgressBar from "../pages/ProgressBar";
import Tooltip from "../pages/Tooltip";
import Dropdown from "../pages/Dropdown";
import Typography from "../pages/Typography";
import Icon from "../pages/Icon";
import LoadingIcon from "../pages/LoadingIcon";
import RegularForm from "../pages/RegularForm";
import Datepicker from "../pages/Datepicker";
import TomSelect from "../pages/TomSelect";
import WysiwygEditor from "../pages/WysiwygEditor";
import Validation from "../pages/Validation";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  // Function to check if the user can access the route

    // Function to check if the user can access the route
  const isAllowed = (path: string) => {
    const restrictedPathsForEmployee = [
      "/add-product",
      "/product-list",
      "/clients",
      "/users-layout-2",
      "/notification",
      "/accordion",
      "/progress-bar",
      "/icon",
      "/loading-icon",
      "/wysiwyg-editor",
      "/chart",
      "/register",
      "/otp",
      "/error-page",
      
    ];

    const restrictedPathsForAdmin = [
      
      "/add-product",
      "/clients",
    ];

    const restrictedPathsForSuperAdmin = [
      "/profile-overview-3",
      "/users-layout-2",
    ];

    // Employee restrictions
    if (role === "employee" && restrictedPathsForEmployee.includes(path)) {
      return false; // Employees are not allowed to access these paths
    }

    // Admin restrictions
    if (role === "admin" && restrictedPathsForAdmin.includes(path)) {
      return false; // Admins are not allowed to access these paths
    }
    
    // Superadmin restrictions
    if (role === "superadmin" && restrictedPathsForSuperAdmin.includes(path)) {
      return false; // Superadmins are not allowed to access these paths
    }
     // Allow all routes for management role
     if (role === "management") {
      return true;
    }

    return true; // All other paths are allowed
  };
  

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
          element: isAllowed("/") ? <DashboardOverview1 /> : <Navigate to="/error-page" />,
        },
        {
          path: "add-product",
          element: isAllowed("/add-product") ? <AddProduct /> : <Navigate to="/error-page" />,
        },
        {
          path: "project-approved",
          element: <ProjectApproved />,
        },
        {
          path: "product-list",
          element: isAllowed("/product-list") ? <ProductList /> : <Navigate to="/error-page" />,
        },
        {
          path: "project-details",
          element: <ProductDetails />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "clients",
          element: isAllowed("/clients") ? <Clients /> : <Navigate to="/error-page" />,
        },
        {
          path: "crud-data-list",
          element: <CrudDataList />,
        },
        {
          path: "crud-form",
          element: <CrudForm />,
        },
        {
          path: "users-layout-2",
          element: isAllowed("/users-layout-2") ? <UsersLayout2 /> : <Navigate to="/error-page" />,
        },
        {
          path: "profile-overview-3",
          element: isAllowed("/profile-overview-3") ? <ProfileOverview3 /> : <Navigate to="/error-page" />,
        },
        {
          path: "update-profile",
          element: <UpdateProfile />,
        },
        {
          path: "change-password",
          element: <ChangePassword />,
        },
        {
          path: "regular-table",
          element: <RegularTable />,
        },
        {
          path: "tabulator",
          element: <Tabulator />,
        },
        {
          path: "modal",
          element: <Modal />,
        },
        {
          path: "slideover",
          element: <Slideover />,
        },
        {
          path: "notification",
          element: isAllowed("/notification") ? <Notification /> : <Navigate to="/error-page" />,
        },
        {
          path: "tab",
          element: <Tab />,
        },
        {
          path: "accordion",
          element: isAllowed("/accordion") ? <Accordion /> : <Navigate to="/error-page" />,
        },
        {
          path: "button",
          element: <Button />,
        },
        {
          path: "alert",
          element: <Alert />,
        },
        {
          path: "progress-bar",
          element: isAllowed("/progress-bar") ? <ProgressBar /> : <Navigate to="/error-page" />,
        },
        {
          path: "tooltip",
          element: <Tooltip />,
        },
        {
          path: "dropdown",
          element: <Dropdown />,
        },
        {
          path: "typography",
          element: <Typography />,
        },
        {
          path: "icon",
          element: isAllowed("/icon") ? <Icon /> : <Navigate to="/error-page" />,
        },
        {
          path: "loading-icon",
          element: isAllowed("/loading-icon") ? <LoadingIcon /> : <Navigate to="/error-page" />,
        },
        {
          path: "regular-form",
          element: <RegularForm />,
        },
        {
          path: "datepicker",
          element: <Datepicker />,
        },
        {
          path: "tom-select",
          element: <TomSelect />,
        },
        {
          path: "wysiwyg-editor",
          element: isAllowed("/wysiwyg-editor") ? <WysiwygEditor /> : <Navigate to="/error-page" />,
        },
        {
          path: "validation",
          element: <Validation />,
        },
        {
          path: "chart",
          element: isAllowed("/chart") ? <Chart /> : <Navigate to="/error-page" />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: isAllowed("/register") ? <Register /> : <Navigate to="/error-page" />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/otp",
      element: isAllowed("/otp") ? <OTP /> : <Navigate to="/error-page" />,
    },
    {
      path: "/resetpassword/:token",
      element:  <NewPassword /> 
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

