import React from "react";
// import axios from "axios";
// import { useState } from "react";

const Login = () => {
  // const [email, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [isLoading, setLoading] = useState("");

  // const handleLogin = () => {
  //   const options = {
  //     method: "POST",
  //     url: "",
  //     data: {
  //       email: email,
  //       password: password,
  //     },
  //   };
  //   axios(options)
  //     .then((response) => {
  //     })
  //     .catch((error) => {

  //     });
  // };

  return (
    <>
      <section className="h-screen bg-[#FCEBF2] flex items-center ">
        <div className="bg-white mx-auto flex flex-col lg:flex-row  w-2/3 lg:w-1/2 lg:rounded-r-[20px] lg:rounded-t-[20px] rounded-t-[20px] rounded-b-[20px]">
          <div className="w-full lg:w-1/2 h-[200px] lg:h-auto login-bg"></div>
          <div className="w-full lg:w-1/2">
            <form className=" border lg:rounded-r-[20px] rounded-b-[20px] lg:rounded-bl-[0px] mx-auto xl:p-5 2xl:p-12 lg:p-4 md:p-5 sm:p-5 p-4">
              <div className="text-center text-[30px] xl:mt-1 xl:mb-7 lg:mb-5 md:mb-4">
                <h1
                  className="text-[18px] sm:text-[22px] md:text-[25px] lg:text-[22px] 
                xl:text-[25px] 2xl:text-[40px]"
                >
                  Welcome
                </h1>
                <p className="text-[12px] sm:text-[12px] md:text-[16px] lg:text-[12px] xl:text-[15px] 2xl:text-[22px]">
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
                  // value={email}
                  // onChange={(e) => setUsername(e.target.value)}
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
                  type="password"
                  // value={password}
                  // onChange={(e) => setPassword(e.target.value)}
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
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white w-full rounded-md hover:bg-blue-600 
                py-[6px] text-[13px] my-5
                sm:py-[6px] sm:text-[13px] sm:my-5
                md:py-[6px] md:text-[13px] md:my-5
                lg:py-1 lg:text-[12px] lg:my-4
                xl:py-1 xl:text-[14px] xl:my-4
                2xl:py-3 2xl:text-[20px] 2xl:my-5"
                // onClick={handleLogin}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
