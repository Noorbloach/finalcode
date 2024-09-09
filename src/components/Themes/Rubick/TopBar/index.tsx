import { useState, Fragment,useEffect } from "react";
import axios from "axios";
import Lucide from "@/components/Base/Lucide";
import Breadcrumb from "@/components/Base/Breadcrumb";
import { FormInput } from "@/components/Base/Form";
import { Menu, Popover } from "@/components/Base/Headless";
import fakerData from "@/utils/faker";
import _ from "lodash";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface Notification {
  _id: string;
  message: string;
}

function Main() {
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const showSearchDropdown = () => setSearchDropdown(true);
  const hideSearchDropdown = () => setSearchDropdown(false);

  const token = localStorage.getItem("token"); // Or get it from context or other storage
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    address: "",
    phoneNo: "",
  });
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    navigate("/"); // Navigate to the home page
  };

  
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // Fetch the token from localStorage (or sessionStorage)
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token
      
      return decodedToken.userId; // Extract and return userId
    }
    return null;
  };

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserIdFromToken(); // Get the userId from the token
      if (!userId) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/auth/user-details/${userId}`); // Fetch user details by userId
        setUserData({
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          address: response.data.user.address,
          phoneNo: response.data.user.phoneNo,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  

  useEffect(() => {
    if (userId) {
      // Fetch notifications for the logged-in user
      const fetchNotifications = async () => {
        try {
          const response = await axios.get<{ data: Notification[] }>(`http://localhost:3000/notifications/user/${userId}`);
        setNotifications(response.data.data); // Access the 'data' key from the response
        console.log(response.data.data); // Check if the data is logged correctly
        setLoadingNotifications(false);
        } catch (err) {
          setError('Failed to load notifications');
          setLoadingNotifications(false);
        }
      };

      fetchNotifications();
    }
  }, [userId]);


  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
        {/* BEGIN: Breadcrumb */}
        <Breadcrumb className="hidden mr-auto -intro-x sm:flex">
          <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
          <Breadcrumb.Link to="/" active={true}>
            Dashboard
          </Breadcrumb.Link>
        </Breadcrumb>
        {/* END: Breadcrumb */}
        {/* BEGIN: Search */}
        <div className="relative mr-3 intro-x sm:mr-6">
          <div className="relative hidden sm:block">
            <FormInput
              type="text"
              className="border-transparent w-56 shadow-none rounded-full bg-slate-300/50 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400/70"
              placeholder="Search..."
              onFocus={showSearchDropdown}
              onBlur={hideSearchDropdown}
            />
            <Lucide
              icon="Search"
              className="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500"
            />
          </div>
          <a className="relative text-slate-600 sm:hidden" href="">
            <Lucide icon="Search" className="w-5 h-5 dark:text-slate-500" />
          </a>
          <Transition
            as={Fragment}
            show={searchDropdown}
            enter="transition-all ease-linear duration-150"
            enterFrom="mt-5 invisible opacity-0 translate-y-1"
            enterTo="mt-[3px] visible opacity-100 translate-y-0"
            leave="transition-all ease-linear duration-150"
            leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
            leaveTo="mt-5 invisible opacity-0 translate-y-1"
          >
            <div className="absolute right-0 z-10 mt-[3px]">
              <div className="w-[450px] p-5 box">
                <div className="mb-2 font-medium">Pages</div>
                <div className="mb-5">
                  <a href="" className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success">
                      <Lucide icon="Inbox" className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Mail Settings</div>
                  </a>
                  <a href="" className="flex items-center mt-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pending/10 text-pending">
                      <Lucide icon="Users" className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Users & Permissions</div>
                  </a>
                  <a href="" className="flex items-center mt-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary/80">
                      <Lucide icon="CreditCard" className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Transactions Report</div>
                  </a>
                </div>
                <div className="mb-2 font-medium">Users</div>
                <div className="mb-5">
                  {_.take(fakerData, 4).map((faker, fakerKey) => (
                    <a
                      key={fakerKey}
                      href=""
                      className="flex items-center mt-2"
                    >
                      <div className="w-8 h-8 image-fit">
                        <img
                          alt="Midone Tailwind HTML Admin Template"
                          className="rounded-full"
                          src={faker.photos[0]}
                        />
                      </div>
                      <div className="ml-3">{faker.users[0].name}</div>
                      <div className="w-48 ml-auto text-xs text-right truncate text-slate-500">
                        {faker.users[0].email}
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mb-2 font-medium">Products</div>
                {_.take(fakerData, 4).map((faker, fakerKey) => (
                  <a key={fakerKey} href="" className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                      <img
                        alt="Midone Tailwind HTML Admin Template"
                        className="rounded-full"
                        src={faker.images[0]}
                      />
                    </div>
                    <div className="ml-3">{faker.products[0].name}</div>
                    <div className="w-48 ml-auto text-xs text-right truncate text-slate-500">
                      {faker.products[0].category}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Transition>
        </div>
        {/* END: Search  */}
        {/* BEGIN: Notifications */}
        <Popover className="mr-auto intro-x sm:mr-6">
          <Popover.Button
            className="
              relative text-slate-600 outline-none block
              before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger
            "
          >
            <Lucide icon="Bell" className="w-5 h-5 dark:text-slate-500" />
          </Popover.Button>
          <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
            <div className="mb-5 font-medium">Notifications</div>
            {loadingNotifications ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification._id} className="flex items-center mt-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary/80">
                      <Lucide icon="Bell" className="w-4 h-4" />
                    </div>
                    <div className="ml-3">{notification.message}</div>
                  </div>
                ))
              ) : (
                <div>No notifications</div>
              )
            )}
          </Popover.Panel>
        </Popover>
        {/* END: Notifications  */}
        {/* BEGIN: Account Menu */}
        <Menu>
          <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
            <img
              alt="Midone Tailwind HTML Admin Template"
              src={fakerData[9].photos[0]}
            />
          </Menu.Button>
          <Menu.Items className="w-56 mt-px text-white bg-primary">
            <Menu.Header className="font-normal">
              <div className="font-medium">{userData.name}</div>
              <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                {userData.role}
              </div>
            </Menu.Header>
            <Menu.Divider className="bg-white/[0.08]" />
            <Menu.Item className="hover:bg-white/5">
              <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
            </Menu.Item>
            <Menu.Item className="hover:bg-white/5">
              <Lucide icon="FilePenLine" className="w-4 h-4 mr-2" /> Add Account
            </Menu.Item>
            <Menu.Item className="hover:bg-white/5">
              <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Reset Password
            </Menu.Item>
            <Menu.Item className="hover:bg-white/5">
              <Lucide icon="HelpCircle" className="w-4 h-4 mr-2" /> Help
            </Menu.Item>
            <Menu.Divider className="bg-white/[0.08]" />
            <Menu.Item className="hover:bg-white/5">
            <button
                onClick={handleLogout}
                className=" px-3 py-2 rounded-md hover:bg-slate-100 w-full text-left flex"
              >
                <Lucide icon="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </button>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      {/* END: Top Bar */}
    </>
  );
}

export default Main;
