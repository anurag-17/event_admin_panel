"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const CreateCategoryForm = ({ closeDrawer, refreshData }) => {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const auth_token = JSON.parse(localStorage.getItem("accessToken"));
  console.log(auth_token, "token");

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    const data = {
      title: title,
    };

    try {
      await fetch("http://3.90.234.160:4000/api/category/createCategory", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: auth_token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.ok) {
            // router.push("/categories");
            refreshData();
            closeDrawer();
            setLoading(false);
          } else {
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className="flex justify-between items-center border border-[#f3f3f3] rounded-lg bg-white
      2xl:px-5  2xl:h-[50px] 2xl:my-5
      xl:px-4  xl:h-[40px] xl:my-4
      lg:px-3  lg:h-[35px] lg:my-2
      md:px-2  md:h-[30px] md:my-2
      sm:px-1 sm:h-[25px] sm:my-2
      px-1 h-[25px] my-2
       "
      >
        <h2 className="2xl:text-2xl xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[10px] text-[9px] font-semibold ">
          Add New Categories{" "}
        </h2>
        <div className="mb-3 w-[40%]"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" bg-white border  rounded-lg 2xl:p-2 xl:p-2  lg:p-1 md:p-2 p-1  mx-auto"
      >
        <div>
          <label
            className="absolute bg-white z-20 text-gray-800
          2xl:text-[18px] 2xl:mt-6 2xl:ml-14
          xl:text-[14px] xl:mt-2 xl:ml-8
          lg:text-[12px] lg:mt-[10px] lg:ml-[26px]
          md:text-[10px] md:mt-2 md:ml-6
          sm:text-[9px] sm:mt-1 sm:ml-5
          text-[8px] mt-[2px] ml-4
          "
          >
            Category Name
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            name="name"
            className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none relative w-10/12  lg:w-8/12 2xl:text-sm 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
            xl:text-md xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
            lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
            md:text-sm md:m-4 md:px-3 md:py-2 md:h-[30px]
            sm:text-sm sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
            text-sm m-2 px-2 py-1 h-[20px]
            "
            required
          />
        </div>
        <button
          type="submit"
          className="border  rounded-lg bg-lightBlue-600 2xl:text-[20px] 2xl:p-2 2xl:m-10 2xl:mt-0
            xl:text-[14px] xl:p-2 xl:m-5 xl:mt-0
            lg:text-[12px] lg:p-2 lg:m-5 lg:mt-0
            md:text-[10px] md:p-1 md:m-4 md:mt-0
            sm:text-[9px] sm:p-1 sm:m-3 sm:mt-0
            text-[8px] p-1 m-2 mt-0
             "
        >
          Add Category
        </button>
      </form>
    </>
  );
};

export default CreateCategoryForm;
