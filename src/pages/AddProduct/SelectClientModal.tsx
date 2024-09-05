import React, { useState } from 'react';
import Button from '@/components/Base/Button';
import { FormInput, FormSelect, FormInline, FormLabel } from '@/components/Base/Form';

interface SelectClientModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (client: any) => void; // Adjust based on your client structure
  clients: any[]; // List of clients for selection
}

const SelectClientModal: React.FC<SelectClientModalProps> = ({ open, onClose, onSelect, clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  if (!open) return null;

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedClient) {
      onSelect(selectedClient);
      onClose();
    }
  };

  return (
    <>
      <div style={overlayStyles} onClick={onClose}></div>
      <div style={modalContainerStyles}>
        <div style={modalStyles}>
          <h2 style={headingStyles}>Select Old Client</h2>
          <FormInline>
            <FormLabel>Search Client:</FormLabel>
            <FormInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </FormInline>
          <div style={{ marginTop: '20px' }}>
            {filteredClients.map(client => (
              <div key={client.id} style={{ marginBottom: '10px' }}>
                <Button onClick={() => setSelectedClient(client)}>{client.name}</Button>
              </div>
            ))}
          </div>
          <div style={footerStyles}>
            <Button variant="secondary" onClick={onClose} style={buttonStyles}>Cancel</Button>
            <Button variant="primary" onClick={handleSelect} style={buttonStyles}>Select</Button>
          </div>
        </div>
      </div>
    </>
  );
};

// Styles for SelectClientModal (same as before)
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
  
  export default SelectClientModal;
  