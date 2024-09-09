import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput,FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import EditProjectModal from "./EditProjectModal"; // Import the new modal component

interface Project {
  _id: string;
  projectName: string;
  status: 'ETA' | 'Proposal Sent' | 'Approved' | 'Rejected';
  subcategory: 'Geoglyphs' | 'Stellar' | 'Perfect';
  projectType: 'Residential' | 'Commercial' | 'Industrial';
  clientDueDate: Date;
  opsDueDate: Date;
  budget: number;
  clientPermanentNotes: string;
  rfiAddendum: string;
  clientType: 'New' | 'Old';
  createdAt: Date;
  creator: string;
}

interface DecodedToken {
  role: string; // Expecting a string role from the JWT token
}

function Main() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [role, setRole] = useState<string>("");// State to track if the user is admin

  // Decode JWT to check if the user is an admin
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded.role)
        setRole(decoded.role); // Set role directly based on decoded token
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);
  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/projects");
        const projectData = response.data.data;
        if (Array.isArray(projectData)) {
          setProjects(projectData);
        } else {
          console.error("Unexpected data format:", projectData);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to open the edit modal and fetch project details
  const handleEditClick = async (projectId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/projects/${projectId}`);
      const projectData = response.data.data;
      console.log(projectData)
      setSelectedProject(projectData);
      setEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Function to handle project update
  const handleUpdateProject = async () => {
    if (selectedProject) {
      try {
        await axios.put(`http://localhost:3000/api/projects/${selectedProject._id}`, selectedProject);
        // Update the project in the state
       
        setProjects(prevProjects => prevProjects.map(p => p._id === selectedProject._id ? selectedProject : p));
        setEditModalOpen(false);
      } catch (error) {
        console.error("Error updating project:", error);
      }
    }
  };

  // Handle input change for the form
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, projects.length);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Project List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button variant="primary" className="mr-2 shadow-md" onClick={() => navigate('/add-product')}>
            Add New Project
          </Button>
          <div className="hidden mx-auto md:block text-slate-500">
            Showing {startIndex + 1} to {endIndex} of {projects.length} entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
            <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Project Title
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Budget
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Due Date
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Status
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Status (Cloned)
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {currentProjects.map((project) => (
                 <Table.Tr key={project._id} className="intro-x">
                 <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                   <a href="" className="font-medium whitespace-nowrap">
                     {project.projectName}
                   </a>
                 </Table.Td>
                 <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                   ${project.budget.toLocaleString()}
                 </Table.Td>
                 <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                   {new Date(project.clientDueDate).toLocaleDateString()}
                 </Table.Td>
                 <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                   {project.status}
                 </Table.Td>
                 <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                   {/* Cloned status with different styling or formatting */}
                   <div className={clsx({
                     'text-success': project.status === 'Approved',
                     'text-warning': project.status === 'Proposal Sent',
                     'text-danger': project.status === 'Rejected',
                     'text-muted': project.status === 'ETA',
                   })}>
                     {project.status === 'Approved' ? '✓ Approved' :
                      project.status === 'Proposal Sent' ? '🕒 Proposal Sent' :
                      project.status === 'Rejected' ? '✘ Rejected' :
                      '⏳ ETA'}
                   </div>
                 </Table.Td>
                 <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                   <div className="flex items-center justify-center">
                     <a className="flex items-center mr-3" href="#" onClick={() => handleEditClick(project._id)}>
                       <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                       Edit
                     </a>
                     <a
                       className="flex items-center text-danger"
                       href="#"
                       
                     >
                       <Lucide icon="Trash2" className="w-4 h-4 mr-1" />{" "}
                       Delete
                     </a>
                   </div>
                 </Table.Td>
               </Table.Tr>              ))}
            </Table.Tbody>
          </Table>
          <div className="flex flex-col items-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
       {/* BEGIN: Pagination */}
       <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link onClick={() => setCurrentPage(1)}>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Link
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Link>
            ))}
            <Pagination.Link onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link onClick={() => setCurrentPage(totalPages)}>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect
            className="w-20 mt-3 !box sm:mt-0"
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            value={itemsPerPage}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="35">35</option>
            <option value="50">50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
     
      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={selectedProject}
        onInputChange={handleInputChange}
        onUpdate={handleUpdateProject}
        role={role} 
      />
    </>
  );
}

export default Main;
