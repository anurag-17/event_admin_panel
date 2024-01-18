import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";

const EditSubCategory = ({ editData, cateEdit, closeDrawer, refreshData,isLoadingBtn, getallCategory }) => {
  const [isLoading, setLoading] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState({
    id: cateEdit,
    category: editData?.category?._id ? editData?.category?._id : "",
  });

  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setCategoryDetails({
      ...categoryDetails,
      [name]: value,
    });
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        "/api/subCategory/updateSubCategory",
        categoryDetails,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: auth_token,
          },
        }
      );
      if (response.status === 200) {
        toast.success("SubCategory Update Successfully!");

        setLoading(false);
        closeDrawer();
        refreshData();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Server error!");
    }
  };


  return (
    <>
      <div
        className=" flex justify-between items-center border border-[#f3f3f3] rounded-lg bg-white
        2xl:px-5  2xl:h-[50px] 2xl:my-5
        xl:px-4  xl:h-[40px] xl:my-4
        lg:px-3  lg:h-[35px] lg:my-2
        md:px-2  md:h-[30px] md:my-2
        sm:px-1 sm:h-[25px] sm:my-2
        px-1 h-[25px] my-2
         "
      >
        <h2 className="2xl:text-[22px] xl:text-[18px] lg:text-[16px] md:text-[14px] sm:text-[12px] text-[10px] font-semibold ">
          Edit Sub-Category{" "}
        </h2>
        <div className="mb-3 w-[40%]"></div>
      </div>

      <div>
        <form
          onSubmit={handleUpdateCategory}
          className=" bg-white border  rounded-lg 2xl:p-2 xl:p-2  lg:p-1 md:p-2 p-1  mx-auto"
        >
          <div className="">
            <label
              className="custom_input_label
            "
            >
              Sub category
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.subCategory}
              type="text"
              name="subCategory"
              className="custom_input capitalize
              "
              required
              maxLength={84}
            />
          </div>

          <div>
            <label
              className="custom_input_label
            "
            >
              Category:
            </label>

            <select
              type="text"
              name="category"
              className="custom_input
 "
              // defaultValue={editData?.category?.title}
              value={categoryDetails?.category}
              onChange={inputHandler}
              required
              max={84}
            >
             
              {isLoadingBtn ? (
                <option value="" disabled className="text-[14px] py-5">
                  Loading.....
                </option>
              ) : (
                <>
                 <option value="" disabled>
                Select Category
              </option>
                  {Array.isArray(getallCategory) &&
                    getallCategory?.length > 0 &&
                    getallCategory?.map((item, index) => (
                      <option key={item?._id} value={item?._id}>
                        {item?.title}
                      </option>
                    ))}
                </>
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="custom_btn"
          >
            {isLoading ? "Loading." : "Update"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditSubCategory;
