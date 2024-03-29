"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../contexts/AuthContext";

const AddSubCategory = ({ closeDrawer, refreshData, getallCategory }) => {
  const [category, setCategory] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [subCategory, setSubCategory] = useState("");
  const { adminAuthToken } = useAuth();

  const handleSubmit = async (e) => {
    e && e.preventDefault();

    if (subCategory === "") {
      toast.warn("Please Enter a subCategory!");
    } else if (category === "") {
      toast.warn("Please Select a Category!");
    } else {
      setLoading(true);

      const data = {
        category: category,
        subCategory: subCategory,
      };

      try {
        await fetch("/api/subCategory/createSubCategory", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: adminAuthToken,
          },
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (res.status === 200) {
              toast.success("SubCategory Added Successfully!");
              setLoading(false);
              refreshData();
              closeDrawer();
            } else {
              setLoading(false);
              throw new Error("failed to create");
            }
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
            toast.error("Subcategory already exist!");
          });
      } catch (error) {
        setLoading(false);
      }
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
        <h2 className="custom_heading_text font-semibold ">
          Add New SubCategory{" "}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" bg-white border  rounded-lg 2xl:p-2 xl:p-2  lg:p-1 md:p-2 p-1  mx-auto"
      >
        <div className="mt-2">
          <label
            className="custom_input_label capitalize
            "
          >
            Sub Category
          </label>
          <input
            name="subCategory"
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="capitalize custom_inputt"
            maxLength={100}
            required
          />
        </div>
        {/*------ category -----*/}
        <div className="gap-3 md:gap-5 xl:gap-6 lg:gap-6 ">
          <label className="custom_input_label">Choose main category</label>
          <div className="w-full">
            <select
              name="category"
              placeholder="Add Category"
              className="rounded custom_inputt capitalize"
              defaultValue={category}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled required>
                Select Category
              </option>
              {Array.isArray(getallCategory) &&
                getallCategory?.length > 0 &&
                getallCategory?.map((item, index) => (
                  <option
                    key={index}
                    value={item?._id}
                    selected={item?.title === category}
                  >
                    {item?.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex justify-center">
        <button
          type="submit"
          className="custom_btn
               "
          disabled={isLoading}
          onClick={() => {
            handleSubmit();
          }}
        >
          {isLoading ? "Loading." : " Add SubCategory"}
        </button>
        </div>
      </form>
    </>
  );
};

export default AddSubCategory;
