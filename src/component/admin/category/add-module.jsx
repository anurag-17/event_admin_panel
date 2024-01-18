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
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    const data = {
      title: title,
    };

    try {
      await fetch("/api/category/createCategory", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: auth_token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.ok) {
            refreshData();
            closeDrawer();
            setLoading(false);
            toast.success("Category Added Successfully!");
          } else {
          }
        })
        .catch((e) => {
          console.log(e);
          toast.error(" Category Added  Failed!");
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
        <h2 className="2xl:text-[22px] xl:text-[18px] lg:text-[16px] md:text-[14px] sm:text-[12px] text-[10px] font-semibold  ">
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
            className="custom_input_label
          "
          >
            Category Name
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            name="name"
            className="custom_input capitalize "
            required
            maxLength={100}
          />
        </div>
        <button
          type="submit"
          className="custom_btn">
          Add Category
        </button>
      </form>
    </>
  );
};

export default CreateCategoryForm;
