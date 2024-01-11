import dynamic from "next/dynamic";
import React, { useState } from "react";
import axios from "axios";

const UpadatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const auth_token = JSON.parse(localStorage.getItem("accessToken"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      return;
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (currentPassword === newPassword) {
      setError("New password must be different from the current password");
      return;
    } else {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/auth/updatePassword",
          {
            oldPassword: currentPassword,
            newPassword: newPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: auth_token,
            },
          }
        );
        if (response.status === 200) {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setError("");
        } else {
        }
      } catch (error) {
        toast.error("Password change failed !");
      }
      setError("");
    }
  };

  return (
    <>
      <div className="mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:pt-4 2xl:px-10 border ml-10 mr-4 lg:mx-8  bg-white rounded-lg   2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
        <h2 className="font-semibold">Change Password </h2>

        <div className="flex items-center w-[40%]"></div>
        <h2>Welcome Back, Admin</h2>
      </div>
      <div className=" flex ml-10 mr-4    mt-4">
        <div className="bg-white  p-5 border mx-auto">
       

          <form onSubmit={handleSubmit}>
            <div className="">
              <div className="">
                <label
                  className=" bg-white z-20 text-gray-800
            2xl:text-[20px] 2xl:mt-5 2xl:ml-12
            xl:text-[16px] xl:mt-[6px] xl:ml-7
            lg:text-[14px] lg:mt-[6px] lg:ml-[26px]
            md:text-[13px] md:mt-1 md:ml-6
            sm:text-[11px] sm:mt-[2px] sm:ml-5
            text-[10px] mt-[0px] ml-4
            "
                >
                  Current Password
                </label>
                <input
                  name="currentPassword"
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none  w-10/12  lg:w-8/12
               2xl:text-[20px] 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
               xl:text-[16px] xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
              lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
              md:text-[13px] md:m-4 md:px-3 md:py-2 md:h-[30px]
              sm:text-[12px] sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
              text-[12px] m-2 px-2 py-1 h-[25px]
              "
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  className=" bg-white z-20 text-gray-800
            2xl:text-[20px] 2xl:mt-5 2xl:ml-12
            xl:text-[16px] xl:mt-[6px] xl:ml-7
            lg:text-[14px] lg:mt-[6px] lg:ml-[26px]
            md:text-[13px] md:mt-1 md:ml-6
            sm:text-[11px] sm:mt-[2px] sm:ml-5
            text-[10px] mt-[0px] ml-4
            "
                >
                  New Password
                </label>
                <input
                  name="newPassword"
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none  w-10/12  lg:w-8/12
               2xl:text-[20px] 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
               xl:text-[16px] xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
              lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
              md:text-[13px] md:m-4 md:px-3 md:py-2 md:h-[30px]
              sm:text-[12px] sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
              text-[12px] m-2 px-2 py-1 h-[25px]
              "
                  required
                />
              </div>

              <div className="mb-2">
                <label
                  className=" bg-white z-20 text-gray-800
            2xl:text-[20px] 2xl:mt-5 2xl:ml-12
            xl:text-[16px] xl:mt-[6px] xl:ml-7
            lg:text-[14px] lg:mt-[6px] lg:ml-[26px]
            md:text-[13px] md:mt-1 md:ml-6
            sm:text-[11px] sm:mt-[2px] sm:ml-5
            text-[10px] mt-[0px] ml-4
            "
                >
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none  w-10/12  lg:w-8/12
               2xl:text-[20px] 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
               xl:text-[16px] xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
              lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
              md:text-[13px] md:m-4 md:px-3 md:py-2 md:h-[30px]
              sm:text-[12px] sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
              text-[12px] m-2 px-2 py-1 h-[25px]
              "
                  required
                />
                {error && (
                  <div className="text-red-500 font-medium px-12">{error}</div>
                )}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="border rounded-md md:rounded-lg bg-lightBlue-600  2xl:text-[20px] 2xl:p-2  2xl:mt-0 2xl:ml-10
              xl:text-[14px] xl:py-2 xl:px-4  xl:mt-0 xl:ml-5
              lg:text-[12px] lg:py-2 lg:px-3 lg:mt-0 lg:ml-5
              md:text-[12px] md:py-2 md:px-2  md:mt-0 md:ml-4
              sm:text-[11px] sm:py-[6px]  sm:px-1  sm:mt-0 sm:ml-3
              text-[10px] py-[3px] px-[6px] m-2 mt-0 bg-blue-500 text-white hover:bg-blue-600 ml-2
               "
                >
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* <div className="w-6/12 my-auto"></div> */}
      </div>
    </>
  );
};

export default UpadatePassword;
