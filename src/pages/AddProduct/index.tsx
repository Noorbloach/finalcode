import _ from "lodash";
import { useState } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import {
  FormInput,
  FormInline,
  FormSelect,
  FormLabel,
  FormCheck,
} from "@/components/Base/Form";
import { ClassicEditor } from "@/components/Base/Ckeditor";
import Lucide from "@/components/Base/Lucide";

function Main() {
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");
  const [clientType, setClientType] = useState("");
  const [editorData, setEditorData] = useState("");
  const [clientDueDate, setClientDueDate] = useState("");
  const [opsDueDate, setOpsDueDate] = useState("");
  const [budget, setBudget] = useState("");
  const [clientPermanentNotes, setClientPermanentNotes] = useState("");
  const [rfiAddendum, setRfiAddendum] = useState("");
  const [projectPlans, setProjectPlans] = useState("");
  const [projectType, setProjectType] = useState("");

  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Add Product</h2>
      </div>
      <div className="grid grid-cols-11 pb-20 mt-5 gap-x-6">
        <div className="col-span-11 intro-y 2xl:col-span-9">
          {/* BEGIN: Product Information */}
          <div className="p-5 mt-5 intro-y box">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Project
                Information
              </div>
              <div className="mt-5">
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Name</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="project-name"
                      type="text"
                      placeholder="Project name"
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Status</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormSelect id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="" disabled>Select Status</option>
                      <option value="ETA">ETA</option>
                      <option value="Approved">Proposal Sent</option>
                      <option value="Rejected">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </FormSelect>
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Subcategory</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>Select Subcategory</option>
                      <option value="geoglyphs">Geoglyphs</option>
                      <option value="stellar">Stellar</option>
                      <option value="perfect">Perfect</option>
                    </select>
                  </div>
                </FormInline>
                {/* New Project Type Dropdown */}
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Type</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormSelect 
                      id="project-type" 
                      value={projectType} 
                      onChange={(e) => setProjectType(e.target.value)}>
                      <option value="" disabled>Select Project Type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                
                    </FormSelect>
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Client Due Date</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="client-due-date"
                      type="date"
                      value={clientDueDate}
                      onChange={(e) => setClientDueDate(e.target.value)}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Op’s Due Date</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="ops-due-date"
                      type="date"
                      value={opsDueDate}
                      onChange={(e) => setOpsDueDate(e.target.value)}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Budget</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="budget"
                      type="text"
                      placeholder="Enter rate"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Client Permanent Notes</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="client-permanent-notes"
                      as="textarea"
                      placeholder="Client permanent notes"
                      rows={4}
                      value={clientPermanentNotes}
                      onChange={(e) => setClientPermanentNotes(e.target.value)}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">RFI/Addendum Upload</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="rfi-addendum-upload"
                      type="text"
                      placeholder="Enter RFI/Addendum path or notes"
                      value={rfiAddendum}
                      onChange={(e) => setRfiAddendum(e.target.value)}
                    />
                  </div>
                </FormInline>
              </div>
            </div>
          </div>
          {/* END: Product Information */}

          {/* BEGIN: Product Detail */}
          <div className="p-5 mt-5 intro-y box">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Product
                Detail
              </div>
              <div className="mt-5">
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Client Type</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <div className="flex flex-col sm:flex-row">
                      <FormCheck className="mr-4">
                        <FormCheck.Input
                          id="condition-new"
                          type="radio"
                          name="client_type"
                          value="new"
                          checked={clientType === "new"}
                          onChange={() => setClientType("new")}
                        />
                        <FormCheck.Label htmlFor="condition-new">
                          New
                        </FormCheck.Label>
                      </FormCheck>
                      <FormCheck className="mt-2 mr-4 sm:mt-0">
                        <FormCheck.Input
                          id="condition-old"
                          type="radio"
                          name="client_type"
                          value="old"
                          checked={clientType === "old"}
                          onChange={() => setClientType("old")}
                        />
                        <FormCheck.Label htmlFor="condition-old">
                          Old
                        </FormCheck.Label>
                      </FormCheck>
                    </div>
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Description</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <ClassicEditor
                      value={editorData}
                      onChange={setEditorData}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Link</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="project-link"
                      type="text"
                      placeholder="Enter Project Link"
                    />
                  </div>
                </FormInline>
              </div>
            </div>
          </div>
          {/* END: Product Detail */}
          
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
              Save & Add New Project
            </Button>
            <Button
              variant="primary"
              type="button"
              className="w-full py-3 md:w-52"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
