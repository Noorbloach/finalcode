import React, { useEffect, useState, ChangeEvent } from 'react';
import _ from 'lodash';
import Button from '@/components/Base/Button';
import Pagination from '@/components/Base/Pagination';
import { FormInput, FormSelect } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import { Menu } from '@/components/Base/Headless';
import axios from 'axios'; // For making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Client {
  name: string;
  email: string;
  phone: string;
  location: string;
}

function Main() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]); // State for filtered clients
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get<Client[]>('http://localhost:3000/api/clients/clients');
        setClients(response.data.clients);
        setFilteredClients(response.data.clients); // Initialize filtered clients with all clients
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Function to handle search input change
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page whenever search term changes

    // Filter clients based on search term
    if (e.target.value.trim() === '') {
      setFilteredClients(clients); // Reset filtered clients to all clients when search term is empty
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const currentClients = _.slice(
    filteredClients,
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page whenever items per page changes
  };

  const handleAddNewClient = () => {
    navigate('/register'); // Update route to add new client
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Clients Data</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button 
            variant="primary" 
            className="mr-2 shadow-md" 
            onClick={handleAddNewClient} 
          >
            Add New Client
          </Button>
          <Menu>
            <Menu.Button as={Button} className="px-2 !box">
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="Users" className="w-4 h-4 mr-2" /> Add Group
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="MessageCircle" className="w-4 h-4 mr-2" /> Send
                Message
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <div className="hidden mx-auto md:block text-slate-500">
            Showing {itemsPerPage * (currentPage - 1) + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Clients Layout */}
        {currentClients.map((client, index) => (
          <div key={index} className="col-span-12 intro-y md:col-span-6">
            <div className="box p-5">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 image-fit">
                  <img
                    alt="Client Avatar"
                    className="rounded-full"
                    src={`https://api.adorable.io/avatars/285/${client.email}.png`} // Use a placeholder image
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')} // Fallback to a default image if the placeholder fails
                  />
                </div>
                <div className="mt-4 text-center">
                  <a href="#" className="font-medium text-lg">
                    {client.name}
                  </a>
                  <div className="text-slate-500 text-sm mt-1">
                    {client.email}
                  </div>
                  <div className="flex justify-center mt-2 space-x-4">
                    <div className="text-slate-500 text-sm">
                      Phone: {client.phone}
                    </div>
                    <div className="text-slate-500 text-sm">
                      Location: {client.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`${
                  index + 1 === currentPage ? 'active' : ''
                } pagination-link`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </button>
          </Pagination>
          <FormSelect
            className="w-20 mt-3 !box sm:mt-0"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
    </>
  );
}

export default Main;
