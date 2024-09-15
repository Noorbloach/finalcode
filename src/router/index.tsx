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


import Layout from "../themes";
import Clients from "../pages/Clients";
import ProjectList from "../pages/ProductList";
import ProductList from "../pages/ProductList";


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
  
};

function Router() {
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
          path: "project-details",
          element: <ProductDetails />,
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
          path: "crud-data-list",
          element: <CrudDataList />,
        },
        {
          path: "crud-form",
          element: <CrudForm />,
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
          element: <Notification />,
        },
        {
          path: "tab",
          element: <Tab />,
        },
        {
          path: "accordion",
          element: <Accordion />,
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
          element: <ProgressBar />,
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
          element: <Icon />,
        },
        {
          path: "loading-icon",
          element: <LoadingIcon />,
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
          element: <WysiwygEditor />,
        },
        {
          path: "validation",
          element: <Validation />,
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
