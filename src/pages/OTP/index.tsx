import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Button from "@/components/Base/Button";
import clsx from "clsx";

function Main() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    otp1: Yup.string().required('Required'),
    otp2: Yup.string().required('Required'),
    otp3: Yup.string().required('Required'),
    otp4: Yup.string().required('Required'),
  });

  const handleOTPSubmit = async (values) => {
    setLoading(true);
    try {
      // Your OTP submission logic here
      const otp = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}`;
      const response = await axios.post('http://localhost:3000/api/auth/verify-otp', { otp });
      setLoading(false);

      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        showConfirmButton: false,
        timer: 1500,
      });

      navigate('/'); // Redirect to the home page or dashboard
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'OTP Verification Failed',
        text: 'Please check the OTP and try again.',
      });
    }
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
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x">
                <img alt="Sufnoor" className="w-6" src={logoUrl} />
                <span className="ml-3 text-lg text-white"> Sufnoor </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Illustration"
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                  A few more clicks to <br />
                  recover your account.
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Manage all your projects in one place
                </div>
              </div>
            </div>
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                  Enter OTP
                </h2>
                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                  Enter the 4-digit OTP sent to your email.
                </div>
                <Formik
                  initialValues={{ otp1: '', otp2: '', otp3: '', otp4: '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleOTPSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="mt-8 intro-x">
                      <div className="flex justify-center space-x-3">
                        <Field
                          name="otp1"
                          type="text"
                          maxLength="1"
                          className={clsx("block w-12 px-3 py-3 text-center border rounded-lg", {
                            'border-red-500': errors.otp1 && touched.otp1,
                            'border-slate-300 dark:border-darkmode-400': !errors.otp1 || !touched.otp1
                          })}
                        />
                        <Field
                          name="otp2"
                          type="text"
                          maxLength="1"
                          className={clsx("block w-12 px-3 py-3 text-center border rounded-lg", {
                            'border-red-500': errors.otp2 && touched.otp2,
                            'border-slate-300 dark:border-darkmode-400': !errors.otp2 || !touched.otp2
                          })}
                        />
                        <Field
                          name="otp3"
                          type="text"
                          maxLength="1"
                          className={clsx("block w-12 px-3 py-3 text-center border rounded-lg", {
                            'border-red-500': errors.otp3 && touched.otp3,
                            'border-slate-300 dark:border-darkmode-400': !errors.otp3 || !touched.otp3
                          })}
                        />
                        <Field
                          name="otp4"
                          type="text"
                          maxLength="1"
                          className={clsx("block w-12 px-3 py-3 text-center border rounded-lg", {
                            'border-red-500': errors.otp4 && touched.otp4,
                            'border-slate-300 dark:border-darkmode-400': !errors.otp4 || !touched.otp4
                          })}
                        />
                      </div>
                      <ErrorMessage name="otp1" component="div" className="mt-2 text-red-500 text-xs" />
                      <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                        <Button
                          variant="primary"
                          className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            'Next'
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
