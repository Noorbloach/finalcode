import { useState, useEffect } from "react";
import Button from "@/components/Base/Button";
import { FormInput, FormInline, FormLabel } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Main() {
  const [project, setProject] = useState(null);

  // Fetch project details when the component mounts
  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      try {
        const response = await axios.get(`http://localhost:3000/api/project/${userId}`);
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProject();
  }, []);

  // Dummy project data for illustration
  const dummyProject = {
    projectName: "Sample Project",
    status: "Approved",
    subcategory: "Geoglyphs",
    projectType: "Residential",
    clientDueDate: "2024-09-30",
    opsDueDate: "2024-10-15",
    editorData: "Sample project description.",
    budget: "10000",
    clientPermanentNotes: "Important notes about the project.",
    rfiAddendum: "RFI details or path.",
    clientType: "new",
  };

  const projectDetails = project || dummyProject;

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Project Details</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 intro-y">
          {/* Project Details Section */}
          <div className="p-5 mt-5 intro-y box">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Project Details
              </div>
              <div className="mt-5">
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Project Name</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.projectName} readOnly />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Status</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.status} readOnly />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Subcategory</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.subcategory} readOnly />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Project Type</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.projectType} readOnly />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Client Due Date</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.clientDueDate} readOnly />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Op’s Due Date</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.opsDueDate} readOnly />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Project Description</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={4}
                      value={projectDetails.editorData}
                      readOnly
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Budget</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.budget} readOnly />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Client Permanent Notes</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={4}
                      value={projectDetails.clientPermanentNotes}
                      readOnly
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">RFI/Addendum</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.rfiAddendum} readOnly />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">Client Type</FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput type="text" value={projectDetails.clientType} readOnly />
                  </div>
                </FormInline>
              </div>
            </div>
          </div>
          {/* END: Project Details */}
        </div>
      </div>
      <div className="flex flex-col justify-end gap-2 mt-5 md:flex-row">
        <Button
          type="button"
          className="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
        >
          Edit Project
        </Button>
        <Button
          variant="primary"
          type="button"
          className="w-full py-3 md:w-52"
        >
          Save
        </Button>
      </div>
    </>
  );
}

export default Main;
