"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { status } = await axios.post(
        "/api/auth/forgotpassword",
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (status === 200) {
        setLoading(false);
        setMsg("The reset link has been sent to your email. Please check your email.");
      } else {
        toast.error("Invalid email!");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data || "Server error");
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-20">
      <div className="w-2/4 lg:w-1/3 border rounded-lg p-5 mx-auto items-center shadow-black">
        <div className="flex justify-between items-center border border-[#f3f3f3] rounded-lg bg-white px-1 h-[25px] my-2">
          <h2 className="text-[12px] font-semibold">Forgot Password</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-lg 2xl:p-10 xl:p-5 lg:p-4 md:p-5 p-3 sm:p-4 mx-auto"
        >
          <div className="">
            <label className="absolute bg-white z-20 text-gray-800">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative"
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
              className="w-full bg-blue-600 font-medium text-white p-[3px] md:p-1 lg:p-1 xl:p-2 rounded-lg hover:bg-blue-800 hover:border xl:h-[40px] 2xl:h-[45px] login-btn 2xl:text-[22px] xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[13px] text-[12px]"
            >
              {isLoading ? "Loading.." : "Get Link"}
            </button>
            <Link href="/auth/login">
              <div className="font-medium underline text-center py-3 cursor-pointer 2xl:text-[22px] xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[13px] text-[12px]">
                Login
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
