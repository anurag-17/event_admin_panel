"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ResetPassword = ({ params }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const resetToken = params?.slug || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        "/api/auth/resetpassword",
        { password: password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        router.push("/auth/login");
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);

      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex mt-20 ">
        <div className="w-1/3 border rounded-lg p-5 mx-auto items-center shadow-black">
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
            <h2 className="2xl:text-[22px] xl:text-[18px] lg:text-[16px] md:text-[14px] sm:text-[12px] text-[10px] font-semibold ">
              New Password{" "}
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              className=" bg-white border  rounded-lg 2xl:p-2 xl:p-5  lg:p-1 md:p-2 p-1  mx-auto"
            >
              <div className="">
                <label
                  className="absolute bg-white z-20 text-gray-800
        2xl:text-[20px] 2xl:mt-5 2xl:ml-12
        xl:text-[16px] xl:mt-[0px] xl:ml-3
        lg:text-[14px] lg:mt-[6px] lg:ml-[26px]
        md:text-[13px] md:mt-1 md:ml-6
        sm:text-[11px] sm:mt-[2px] sm:ml-5
        text-[10px] mt-[0px] ml-4
        "
                >
                  Email Address
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(!password)}
                  className=" w-full rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none relative
           2xl:text-[20px] 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
           xl:text-[16px] xl:mt-[14px] xl:m-0 xl:px-3 xl:py-1 xl:h-[40px]
          lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
          md:text-[13px] md:m-4 md:px-3 md:py-2 md:h-[30px]
          sm:text-[12px] sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
          text-[12px] m-2 px-2 py-1 h-[25px]
          "
                  required
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 font-medium text-white p-2 rounded-lg  hover:bg-blue-800 hover:border  xl:h-[40px] login-btn"
                >
                  {isLoading ? "Loading.." : "Get  link"}
                </button>
                <Link href="/auth/login">
                  <div className="text-[16px] font-medium underline text-center py-3 cursor-password">
                    Update
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

export default ResetPassword;
