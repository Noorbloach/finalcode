import React, { useEffect, useState, ChangeEvent } from 'react';
import _ from 'lodash';
import Button from '@/components/Base/Button';
import Pagination from '@/components/Base/Pagination';
import { FormInput, FormSelect } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import axios from 'axios'; // For making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface User {
  name: string;
  role: string;
  email: string;
}

function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:3000/api/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Function to handle page changes
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Function to handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page whenever items per page changes
  };

  // Function to handle search input change
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page whenever search term changes
  };

  // Filter users based on search term
  let filteredUsers = users;
  if (searchTerm.trim() !== '') {
    filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Slice the users array to get users for the current page
  const currentUsers = _.slice(
    filteredUsers,
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to navigate to add new user page
  const handleAddNewUser = () => {
    navigate('/register');
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Users Layout</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button
            variant="primary"
            className="mr-2 shadow-md"
            onClick={handleAddNewUser}
          >
            Add New User
          </Button>
          
          <div className="hidden mx-auto md:block text-slate-500">
            Showing{' '}
            {itemsPerPage * (currentPage - 1) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
            {filteredUsers.length} entries
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
        {/* BEGIN: Users Layout */}
        {currentUsers.map((user, index) => (
          <div key={index} className="col-span-12 intro-y md:col-span-6">
            <div className="box">
              <div className="flex flex-col items-center p-5 lg:flex-row">
                <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                  <img
                    alt="User Avatar"
                    className="rounded-full"
                    src={`src/pages/Clients/612.jpg`} // Updated image path
                  />
                </div>
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                  <a href="#" className="font-medium">
                    {user.name}
                  </a>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {user.role}
                  </div>
                </div>
                <div className="flex mt-4 lg:mt-0">
                  <Button variant="outline-secondary" className="px-2 py-1">
                    Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination
            className="w-full sm:w-auto sm:mr-auto"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
