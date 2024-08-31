import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import clsx from "clsx";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import { Dialog, Menu } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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

function Main() {
  const navigate = useNavigate(); // Initialize navigate
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const [projects, setProjects] = useState<Project[]>([]); // State to store projects
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/projects");
        const projectData = response.data.data; // Access the array inside "data"
        console.log(projectData);
        if (Array.isArray(projectData)) { // Ensure the projectData is an array
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

  // Function to add a new project at the top
  const addNewProject = (newProject: Project) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
  };

  // Handle click for adding a new project
  const handleAddNewProjectClick = () => {
    navigate('/add-product'); // Navigate to the Add Product page
  };

  if (loading) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Project List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button variant="primary" className="mr-2 shadow-md" onClick={handleAddNewProjectClick}>
            Add New Project
          </Button>
          <Menu>
            <Menu.Button as={Button} className="px-2 !box">
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                Excel
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                PDF
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <div className="hidden mx-auto md:block text-slate-500">
            Showing 1 to {projects.length} of {projects.length} entries
          </div>
        </div>
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
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
                    Actions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {projects.slice().reverse().map((project) => (
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
                    <Table.Td className="box w-40 rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                      {project.status}
                    </Table.Td>
                    <Table.Td className="box w-56 rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                      <div className="flex items-center justify-center">
                        <a className="flex items-center mr-3" href="#">
                          <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                          Edit
                        </a>
                        <a
                          className="flex items-center text-danger"
                          href="#"
                          onClick={() => setDeleteConfirmationModal(true)}
                        >
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />{" "}
                          Delete
                        </a>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>
        {/* END: Data List */}
        <Pagination className="flex-wrap items-center col-span-12 intro-y sm:flex sm:flex-nowrap" />
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => setDeleteConfirmationModal(false)}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide icon="XCircle" className="w-16 h-16 mx-auto mt-3 text-danger" />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setDeleteConfirmationModal(false)}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
