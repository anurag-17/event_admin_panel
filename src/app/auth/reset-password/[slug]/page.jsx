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
            Change Password
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              className=" bg-white border  rounded-lg 2xl:p-2 xl:p-5  lg:p-1 md:p-2 p-1  mx-auto"
            >
              <div className="">
                <label
                  className="custom_input_label"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(!password)}
                  className="custom_input"
                  required
                />
              </div>

              <div className="mt-4">
                <Link href="/auth/login">
                  <button
                    type="submit"
               
                    className="custom_btn"
                  >
                  Update Password
                  </button>
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
