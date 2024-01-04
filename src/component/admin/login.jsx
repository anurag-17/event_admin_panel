"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const addFormHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    const options = {
      method: "POST",
      url: "http://localhost:4000/api/auth/adminLogin",
      data: { email: email, password: password },
    };
    axios
      .request(options)
      .then(function (response) {
        if (response?.status === 201) {
          localStorage.setItem(
            "accessToken",
            JSON.stringify(response.data.token)
          );
          localStorage.setItem(
            "userDetails",
            JSON.stringify(response?.data?.user?._id)
          );
          toast.success("Success. Login Successfully!");
          router.push("/admin/admin-dashboard");
        } else {
          setLoading(false);
          return;
        }
      })
      .catch(function (error) {
        setLoading(false);
        toast.error(" Login Failed!");
        console.error(error);
      });
  };

  const loginwithgoogle = ()=>{
    window.open("http://3.90.234.160:4000/auth/google/callback","_self")
}
  const loginwithfacebook = ()=>{
    window.open("http://3.90.234.160:4000/auth/facebook/callback","_self")
}

  return (
    <>
      <ToastContainer />
      <section className="h-screen bg-[#FCEBF2] flex items-center ">
        <div className="bg-white mx-auto flex flex-col lg:flex-row  w-1/3 lg:w-1/2 lg:rounded-r-[20px] lg:rounded-t-[20px] rounded-t-[20px] rounded-b-[20px]">
          <div className="w-full lg:w-1/2 h-[200px] lg:h-auto login-bg"></div>
          <div className="w-full lg:w-1/2">
            <form
              onSubmit={addFormHandler}
              className=" border lg:rounded-r-[20px] rounded-b-[20px] lg:rounded-bl-[0px] mx-auto xl:p-5 2xl:p-12 lg:p-4 md:p-5 sm:p-5 p-4"
            >
              <div className="text-center text-[30px] xl:mt-1 xl:mb-7 lg:mb-5 md:mb-4">
                <h1
                  className="text-[18px] sm:text-[22px] md:text-[25px] lg:text-[22px] 
                xl:text-[25px] 2xl:text-[40px] font-semibold"
                >
                  Welcome
                </h1>
                <p className=" text-gray-600 text-[12px] sm:text-[12px] md:text-[16px] lg:text-[12px] xl:text-[15px] 2xl:text-[22px] font-semibold">
                  We create, You Celebrate
                </p>
              </div>
              <div className="sm: mb-2 md:mb-3 lg:mb-3 xl:mb-4 2xl:mb-6 ">
                <label
                  htmlFor="username"
                  className="text-[13px] leading-[16px] 
                   sm:text-[13px] sm:leading-[16px] 
                  md:text-[13px] md:leading-[16px]
                   lg:text-[12px] lg:leading-[16px]
                   xl:text-sm  xl:leading-[20px]
                    2xl:text-[22px] 2xl:leading-[25px] font-medium text-gray-600"
                >
                  Username :
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setUsername(e.target.value)}
                  id="username"
                  name="email"
                  className="mt-[2px] p-[6px] text-[11px] 
                  sm:mt-[2px] sm:p-[6px] sm:text-[11px] 
                  md:mt-[2px] md:p-[6px] md:text-[12px]
                  lg:mt-1 lg:p-[6px] lg:text-[11px]
                  xl:mt-[6px] xl:p-[8px] xl:text-[12px]
                  2xl:mt-2 2xl:p-[12px] 2xl:text-[20px] 
                  w-full border rounded-md focus:outline-none "
                />
              </div>
              <div className="xl:mb-4">
                <label
                  htmlFor="password"
                  className="block sm:text-[13px] sm:leading-[16px] 
                  text-[13px] leading-[16px] 
                   md:text-[13px] md:leading-[16px]
                    lg:text-[12px] lg:leading-[16px]
                  xl:text-sm xl:leading-[20px]
                  2xl:text-[22px] 2xl:leading-[25px] font-medium text-gray-600"
                >
                  Password :
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  className="mt-[2px] p-[6px] text-[11px] 
                  sm:mt-[2px] sm:p-[6px] sm:text-[11px] 
                  md:mt-[2px] md:p-[6px] md:text-[12px] 
                  lg:mt-1 lg:p-[6px] lg:text-[11px]
                  xl:mt-[6px] xl:p-[8px] xl:text-[12px]
                  2xl:mt-2 2xl:p-[12px] 2xl:text-[20px] 
                  w-full border rounded-md focus:outline-none "
                />
                <div>
                  <p
                    className="cursor-pointer text-blue-700  xl:my-1 py-[6px] text-[13px] my-5
               sm:text-[13px] 
               md:text-[13px] 
               lg:text-[12px] 
               xl:text-[13px]  
                 2xl:text-[20px] 2xl:my-2"
                  >
                    Forgot Password
                  </p>
                </div>
                <button
                  type="button"
                  className="absolute top-1/2  transform -translate-y-1/2 cursor-pointer"
                  onClick={handleToggle}
                ></button>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white w-full rounded-md hover:bg-blue-600 
                py-[6px] text-[13px] my-5
                sm:py-[6px] sm:text-[13px] sm:my-5
                md:py-[6px] md:text-[13px] md:my-5
                lg:py-[6px] lg:text-[12px] lg:my-4
                xl:py-2 xl:text-[14px] xl:my-4
                2xl:py-3 2xl:text-[20px] 2xl:my-5"
              >
                Login
              </button>
            </form>

          <div className="text-center">
          <button className='login-with-google-btn my-1' onClick={loginwithgoogle}>
                    Sign In With Google
                </button>
          </div>
          <div className="text-center">
          <button className='login-with-facebook-btn my-1' onClick={loginwithfacebook}>
                    Sign In With Facebook
                </button>
          </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Login;
