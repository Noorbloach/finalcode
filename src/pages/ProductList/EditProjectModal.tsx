import React, { ChangeEvent } from "react";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import { Project } from "./Main"; // Import the Project type

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onUpdate: () => void;
  role: string;
  
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ open, onClose, project, onInputChange, onUpdate,role }) => {
  if (!open || !project) return null;

  // Handle select change
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onInputChange(e);
  };
  console.log("Client Type Value:", project.status); 
 
   // Render status options based on role
    // Render status options based on role and current status
  const renderStatusOptions = () => {

    if (role === 'superadmin') {
      if (project.status === 'Proposal Sent') {
        return (
          <>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Project Started">Project Started</option>
           
          </>
        );
      }
      return (
        <>
          <option value="ETA">ETA</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Project Started">Project Started</option>
        </>
      );
    }


    if (role === 'admin') {
      if (project.status === 'Proposal Sent') {
        // Admin cannot change status if it's Proposal Sent
        return (
          <option value={project.status} disabled>{project.status}</option>
        );
      }
      if (project.status === 'ETA') {
        return (
          <>
            <option value="">Select</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </>
        );
      }
      return (
        <>
          <option value="ETA">ETA</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </>
      );
    } else if (role === 'superadmin') {
      if (project.status === 'Proposal Sent') {
        return (
          <>
            <option value="Proposal Sent">Proposal Sent</option>
           
          </>
        );
      }
        // Determine if the field should be disabled for admin (superadmin can edit all)
  
      return (
        <>
          <option value="ETA">ETA</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </>
      );
    }
    return (
      <>
        <option value="ETA">ETA</option>
        <option value="Proposal Sent">Proposal Sent</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </>
    );
  };

  const isFieldDisabled = role === "admin";
  return (
    <>
      <div style={overlayStyles} onClick={onClose}></div>
      <div style={modalContainerStyles}>
        <div style={modalStyles}>
          <h2 style={headingStyles}>Edit Project</h2>
          <div style={formContainerStyles}>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Project Name:</label>
              <FormInput
                name="projectName"
                value={project.projectName}
                onChange={onInputChange}
                type="text"
                style={inputStyles}
                disabled={isFieldDisabled}
              />
            </div>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Status:</label>
              <FormSelect
                name="status"
                value={project.status}
                onChange={handleSelectChange}
                style={selectStyles}
                disabled={false}
              >
                {renderStatusOptions()}
              </FormSelect>
            </div>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Budget:</label>
              <FormInput
                name="budget"
                value={project.budget}
                onChange={onInputChange}
                type="number"
                style={inputStyles}
                disabled={isFieldDisabled}
              />
            </div>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Client Due Date:</label>
              <FormInput
                name="clientDueDate"
                value={new Date(project.clientDueDate).toISOString().substring(0, 10)}
                onChange={onInputChange}
                type="date"
                style={inputStyles}
                disabled={isFieldDisabled}
              />
            </div>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Ops Due Date:</label>
              <FormInput
                name="opsDueDate"
                value={new Date(project.opsDueDate).toISOString().substring(0, 10)}
                onChange={onInputChange}
                type="date"
                style={inputStyles}
                disabled={isFieldDisabled}
              />
            </div>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Client Permanent Notes:</label>
              <FormInput
                name="clientPermanentNotes"
                value={project.clientPermanentNotes}
                onChange={onInputChange}
                type="text"
                style={inputStyles}
                disabled={isFieldDisabled}
              />
            </div>
            <div style={formGroupStyles}>
              <label style={labelStyles}>RFI Addendum:</label>
              <FormInput
                name="rfiAddendum"
                value={project.rfiAddendum}
                onChange={onInputChange}
                type="text"
                style={inputStyles}
                disabled={isFieldDisabled} 
              />
            </div>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Client Type:</label>
              <FormSelect
                name="clientType"
                value={project.clientType}
                onChange={handleSelectChange}
                style={selectStyles}
                disabled={isFieldDisabled}
              >
                <option value="New">New</option>
                <option value="Old">Old</option>
              </FormSelect>
            </div>
          </div>
          <div style={footerStyles}>
            <Button variant="secondary" onClick={onClose} style={buttonStyles}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onUpdate} style={buttonStyles}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// Styles remain the same as in your original code




// Styles for overlay, modal container, and modal
const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
};

const modalContainerStyles: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  zIndex: 1001,
};

const modalStyles: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  width: '500px',
  maxWidth: '90%',
  overflowY: 'auto',
};

const headingStyles: React.CSSProperties = {
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: '600',
  color: '#333',
};

const formContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const formGroupStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};

const labelStyles: React.CSSProperties = {
  flex: '0 0 150px', // Fixed width for labels
  fontWeight: '500',
  color: '#555',
};

const inputStyles: React.CSSProperties = {
  flex: '1', // Takes remaining space
  marginBottom: '15px',
};

const selectStyles: React.CSSProperties = {
  flex: '1', // Takes remaining space
  marginBottom: '15px',
};

const footerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
  gap: '10px',
};

const buttonStyles: React.CSSProperties = {
  padding: '10px 20px',
};

export default EditProjectModal;
