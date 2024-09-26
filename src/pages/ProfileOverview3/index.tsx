import _ from "lodash";
import clsx from "clsx";
import { useRef } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import { FormSwitch } from "@/components/Base/Form";
import Progress from "@/components/Base/Progress";
import TinySlider, { TinySliderElement } from "@/components/Base/TinySlider";
import Lucide from "@/components/Base/Lucide";
import ReportLineChart from "@/components/ReportLineChart";
import { Menu, Tab } from "@/components/Base/Headless";
import { Tab as HeadlessTab } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode for decoding the token

function Main() {
  const announcementRef = useRef<TinySliderElement>();
  const newProjectsRef = useRef<TinySliderElement>();
  const todaySchedulesRef = useRef<TinySliderElement>();
const [currentIndex, setCurrentIndex] = useState(0);

const [userData, setUserData] = useState({
  name: "",
  role: "",
 
});

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
       
        role: response.data.user.role,
   
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchUserData();
}, []);
  const [projects, setProjects] = useState([]);

   // Decode the JWT token and extract the userId
   const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // Fetch the token from localStorage (or sessionStorage)
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token
      
      return decodedToken.userId; // Extract and return userId
    }
    return null;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const employeeId = getUserIdFromToken(); // Replace with the actual employee ID or retrieve it dynamically
        const response = await axios.get(`http://localhost:3000/api/projects/employee/${employeeId}`);
        setProjects(response.data.data); // Assuming the API returns an array of projects
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextProject(); // Automatically go to the next project every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentIndex, projects]);

  const prevAnnouncement = () => {
    announcementRef.current?.tns.goTo("prev");
  };
  const nextAnnouncement = () => {
    announcementRef.current?.tns.goTo("next");
  };
  const prevNewProjects = () => {
    newProjectsRef.current?.tns.goTo("prev");
  };
  const nextNewProjects = () => {
    newProjectsRef.current?.tns.goTo("next");
  };
  const prevTodaySchedules = () => {
    todaySchedulesRef.current?.tns.goTo("prev");
  };
  const nextTodaySchedules = () => {
    todaySchedulesRef.current?.tns.goTo("next");
  };
// Function to go to the next project
const nextProject = () => {
  if (currentIndex < projects.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};

// Function to go to the previous project
const prevProject = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
  }
};
  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Profile Layout</h2>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: Profile Menu */}
        <div className="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
          <div className="mt-5 intro-y box lg:mt-0">
            <div className="relative flex items-center p-5">
              <div className="w-12 h-12 image-fit">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="rounded-full"
                  src={fakerData[0].photos[0]}
                />
              </div>
              <div className="ml-4 mr-auto">
                <div className="text-base font-medium">
                  {userData.name}
                </div>
                <div className="text-slate-500">{userData.role}</div>
              </div>
              <Menu>
                <Menu.Button as="a" className="block w-5 h-5">
                  <Lucide
                    icon="MoreHorizontal"
                    className="w-5 h-5 text-slate-500"
                  />
                </Menu.Button>
                <Menu.Items className="w-56">
                  <Menu.Header>Export Options</Menu.Header>
                  <Menu.Divider />
                  <Menu.Item>
                    <Lucide icon="Activity" className="w-4 h-4 mr-2" />
                    English
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="Box" className="w-4 h-4 mr-2" />
                    Indonesia
                    <div className="px-1 ml-auto text-xs text-white rounded-full bg-danger">
                      10
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="PanelsTopLeft" className="w-4 h-4 mr-2" />
                    English
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="PanelLeft" className="w-4 h-4 mr-2" />
                    Indonesia
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Footer>
                    <Button
                      variant="primary"
                      type="button"
                      className="px-2 py-1"
                    >
                      Settings
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      className="px-2 py-1 ml-auto"
                    >
                      View Profile
                    </Button>
                  </Menu.Footer>
                </Menu.Items>
              </Menu>
            </div>
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              <a className="flex items-center font-medium text-primary" href="">
                <Lucide icon="Activity" className="w-4 h-4 mr-2" /> Personal
                Information
              </a>
              <a className="flex items-center mt-5" href="">
                <Lucide icon="Box" className="w-4 h-4 mr-2" /> Account Settings
              </a>
              <a className="flex items-center mt-5" href="">
                <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Change Password
              </a>
              <a className="flex items-center mt-5" href="">
                <Lucide icon="Settings" className="w-4 h-4 mr-2" /> User
                Settings
              </a>
            </div>
            
            
          </div>
          
        </div>
         {/* END: Profile Menu */}
         <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          <div className="grid grid-cols-12 gap-6">
            {/* BEGIN: Projects */}
            <div className="col-span-12 intro-y box 2xl:col-span-6">
              <div className="flex items-center px-5 py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">Projects</h2>
              </div>
              <div className="flex justify-between items-center p-5">
                <Button
                  variant="outline-secondary"
                  className="px-2"
                  onClick={prevProject}
                  disabled={currentIndex === 0}
                >
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center">
                  {projects.length > 0 ? (
                    <>
                      <div className="text-lg font-medium">
                        {projects[currentIndex].projectName}
                      </div>
                      <div className="mt-2 text-slate-600 dark:text-slate-500">
                        {projects[currentIndex].description.replace(/<\/?p>/g, "")}
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-600">No projects available</div>
                  )}
                </div>
                <Button
                  variant="outline-secondary"
                  className="px-2"
                  onClick={nextProject}
                  disabled={currentIndex === projects.length - 1}
                >
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* END: Projects */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
