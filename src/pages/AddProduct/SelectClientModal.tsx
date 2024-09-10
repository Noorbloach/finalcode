import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@/components/Base/Button';

interface Client {
  _id: string;
  name: string;
  email: string;
}

interface SelectClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientSelect: (client: Client) => void;
}

const SelectClientModal: React.FC<SelectClientModalProps> = ({ open, onClose, onClientSelect }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  if (!open) return null;

  return (
    <div>
      <div style={overlayStyles} onClick={onClose}></div>
      <div style={modalContainerStyles}>
        <div style={modalStyles}>
          <h2>Select Existing Client</h2>
          <ul>
            {clients.map(client => (
              <li key={client._id} onClick={() => onClientSelect(client)}>
                {client.name} - {client.email}
              </li>
            ))}
          </ul>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

// Styles for SelectClientModal
const overlayStyles = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
};
const modalContainerStyles = {
  position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1001,
};
const modalStyles = {
  backgroundColor: '#fff', padding: '30px', borderRadius: '10px', width: '500px', maxWidth: '90%', overflowY: 'auto',
};

export default SelectClientModal;
