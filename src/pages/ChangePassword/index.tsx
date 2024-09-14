import _ from "lodash";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import { FormInput, FormLabel } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";

function Main() {
  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Change Password</h2>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* BEGIN: Profile Menu */}
        <div className="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
          <div className="mt-5 intro-y box">
            <div className="relative flex items-center p-5">
              <div className="w-12 h-12 image-fit">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="rounded-full"
                  src={fakerData[0].photos[0]}
                />
              </div>
              <div className="ml-4 mr-auto">
                <div className="text-base font-medium">
                  {fakerData[0].users[0].name}
                </div>
                <div className="text-slate-500">{fakerData[0].jobs[0]}</div>
              </div>
              
            </div>
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              <a className="flex items-center mt-5" href="/update-profile">
                <Lucide icon="Activity" className="w-4 h-4 mr-2" /> Personal
                Information
              </a>
              
              <a className="flex items-center mt-1 font-medium text-primary" href="">
                <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Change Password
              </a>
              
            </div>
           
          </div>
        </div>
        {/* END: Profile Menu */}
        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          {/* BEGIN: Change Password */}
          <div className="intro-y box lg:mt-5">
            <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <h2 className="mr-auto text-base font-medium">Change Password</h2>
            </div>
            <div className="p-5">
              <div>
                <FormLabel htmlFor="change-password-form-1">
                  Old Password
                </FormLabel>
                <FormInput
                  id="change-password-form-1"
                  type="password"
                  placeholder="Input text"
                />
              </div>
              <div className="mt-3">
                <FormLabel htmlFor="change-password-form-2">
                  New Password
                </FormLabel>
                <FormInput
                  id="change-password-form-2"
                  type="password"
                  placeholder="Input text"
                />
              </div>
              <div className="mt-3">
                <FormLabel htmlFor="change-password-form-3">
                  Confirm New Password
                </FormLabel>
                <FormInput
                  id="change-password-form-3"
                  type="password"
                  placeholder="Input text"
                />
              </div>
              <Button variant="primary" type="button" className="mt-4">
                Change Password
              </Button>
            </div>
          </div>
          {/* END: Change Password */}
        </div>
      </div>
    </>
  );
}

export default Main;
