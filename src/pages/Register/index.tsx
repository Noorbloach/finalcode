import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FormInput, FormSelect } from "@/components/Base/Form"; // Assuming you have a FormSelect component
import Button from "@/components/Base/Button";
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userRole, setUserRole] = useState(''); // To store the role of the logged-in user

  // Fetch and decode the token to get the user's role
  useEffect(() => {
    const fetchUserRole = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          console.log(decodedToken.role)
          setUserRole(decodedToken.role); // Extract the role from the decoded token
        }
      } catch (err) {
        setError('Error decoding token.');
      }
    };

    fetchUserRole();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess('Registration successful!');
        setError(null);
        // Optionally, you can redirect the user or clear the form
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'Employee'
        });
      } else {
        setSuccess(null);
        setError(result.message || 'Something went wrong!');
      }
    } catch (err) {
      setSuccess(null);
      setError('Server error. Please try again later.');
    }
  };
  const handleregister = () => {
    navigate('/users-layout-2'); // Navigate to the /register page
  };

  return (
    <>
      <div
        className={clsx([
          "p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <ThemeSwitcher />
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Register Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-6"
                  src={logoUrl}
                />
                <span className="ml-3 text-lg text-white"> Rubick </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                  A few more clicks to <br />
                  sign up to your account.
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Manage all your e-commerce accounts in one place
                </div>
              </div>
            </div>
            {/* END: Register Info */}
            {/* BEGIN: Register Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                  Sign Up
                </h2>
                <div className="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
                  A few more clicks to sign in to your account. Manage all your
                  e-commerce accounts in one place
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mt-8 intro-x">
                    <FormInput
                      name="name"
                      type="text"
                      className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <FormInput
                      name="email"
                      type="email"
                      className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <FormInput
                      name="password"
                      type="password"
                      className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <FormSelect
                      name="role"
                      className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={userRole === 'admin'} // Disable select if userRole is 'Admin'
                    >
                      {userRole === 'superadmin' ? (
                        <>
                          <option value="admin">admin</option>
                          <option value="employee">employee</option>
                        </>
                      ) : (
                        <option value="employee">employee</option>
                      )}
                    </FormSelect>
                  </div>

                  <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                    <Button
                      variant="primary"
                      className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                      type="submit"
                      onClick={handleregister}
                    >
                      Register
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                    >
                      Sign in
                    </Button>
                  </div>
                </form>
                {error && (
                  <div className="mt-4 text-center text-red-500">{error}</div>
                )}
                {success && (
                  <div className="mt-4 text-center text-green-500">{success}</div>
                )}
              </div>
            </div>
            {/* END: Register Form */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
