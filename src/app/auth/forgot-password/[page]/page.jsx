"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const token = JSON.parse(localStorage.getItem("authToken" || ""));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/forgotpassword",
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      if (response.status === 200) {
        // toast.success("Mail sent, Please check your mail!");
        setLoading(false);
        setMsg(
          "The reset link has been sent to your email. Please check your email."
        );
      } else {
        toast.error("Invalid email!");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data || "server error");
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <>
      <div className="flex mt-20 ">
        <div className="w-2/4 lg:w-1/3 border rounded-lg p-5 mx-auto items-center shadow-black">
          <div
            className="flex justify-between items-center border border-[#f3f3f3] rounded-lg bg-white
      2xl:px-5  2xl:h-[50px] 2xl:my-5
      xl:px-4  xl:h-[40px] xl:my-2
      lg:px-3  lg:h-[35px] lg:my-2
      md:px-2  md:h-[30px] md:my-2
      sm:px-1 sm:h-[25px] sm:my-2
      px-1 h-[25px] my-2
       "
          >
            <h2 className="2xl:text-[25px] xl:text-[22px] lg:text-[20px] md:text-[20px] sm:text-[16px] text-[12px] font-semibold ">
              Forgot Password{" "}
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              className=" bg-white border  rounded-lg 2xl:p-10 xl:p-5 lg:p-4 md:p-5 p-3 sm:p-4  mx-auto"
            >
              <div className="">
                <label
                  className="absolute bg-white z-20 text-gray-800
          2xl:text-[20px] 2xl:mt-5 2xl:ml-3
          xl:text-[16px] xl:mt-[0px] xl:ml-3
          lg:text-[14px] lg:mt-[3px] lg:ml-[10px]
          md:text-[14px] md:mt-0 md:ml-3
          sm:text-[12px] sm:mt-[2px] sm:ml-3
          text-[11px] mt-[0px] ml-2
          "
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className=" w-full rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none relative
             2xl:text-[20px] 2xl:m-0 2xl:mt-9 2xl:px-3 2xl:py-2 2xl:h-[50px]
             xl:text-[16px] xl:mt-[14px] xl:m-0 xl:px-3 xl:py-1 xl:h-[40px]
            lg:text-sm lg:mt-4  lg:px-2 lg:py-1 lg:h-[35px]
            md:text-[13px]  md:px-3 md:py-2 md:h-[35px]
            sm:text-[12px] sm:mt-3 sm:px-2 sm:py-1 sm:h-[32px]
            text-[12px] mt-[10px] px-2 py-1 h-[28px]
            "
                  required
                />
              </div>
              {msg && (
                <div className="py-2 px-4 rounded text-[green] bg-[#e0f8e0c1] font-medium text-[15px]">
                  {msg}
                </div>
              )}

              <div className="mt-4 2xl:mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 font-medium text-white p-[3px] md:p-1 lg:p-1 xl:p-2 rounded-lg  hover:bg-blue-800 hover:border  xl:h-[40px]
                  2xl:h-[45px] login-btn 2xl:text-[22px] xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[13px] text-[12px]"
                >
                  {isLoading ? "Loading.." : "Get  link"}
                </button>

                <Link href="/auth/login">
                  <div className=" font-medium underline text-center py-3 cursor-password 2xl:text-[22px] xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[13px] text-[12px]">
                    Login
                  </div>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
