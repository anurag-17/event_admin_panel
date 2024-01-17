import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";

const EditSubCategory = ({ editData, cateEdit, closeDrawer, refreshData }) => {
  const [isLoading, setLoading] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState({
    id: cateEdit, 
   category : editData?.category?._id ? editData?.category?._id : ""
 });

  const [getallCategory, setGetallCategory] = useState();
  const [isLoadingBtn, setLoadingBtn] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
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

  useEffect(() => {
    defaultCategory();
  }, [isRefresh]);

  const defaultCategory = () => {
    setLoadingBtn(true);
    const options = {
      method: "GET",
      url: "/api/category/getallCategory",
    };

    axios
      .request(options)
      .then((response) => {
        setGetallCategory(response?.data);
        setLoadingBtn(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoadingBtn(false);
      });
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
              className="absolute bg-white z-20 text-gray-800
            2xl:text-[20px] 2xl:mt-5 2xl:ml-12
            xl:text-[16px] xl:mt-[6px] xl:ml-7
            lg:text-[14px] lg:mt-[6px] lg:ml-[26px]
            md:text-[13px] md:mt-1 md:ml-6
            sm:text-[11px] sm:mt-[2px] sm:ml-5
            text-[10px] mt-[0px] ml-4 capitalize
            "
            >
              Sub category
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.subCategory}
              type="text"
              name="subCategory"
              className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none relative w-10/12  lg:w-8/12
               2xl:text-[20px] 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
               xl:text-[16px] xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
              lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
              md:text-[13px] md:m-4 md:px-3 md:py-2 md:h-[30px]
              sm:text-[12px] sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
              text-[12px] m-2 px-2 py-1 h-[25px] capitalize
              "
              required
            />
          </div>

          <div>
            <label
              className="absolute bg-white z-20 text-gray-800
            2xl:text-[20px] 2xl:mt-5 2xl:ml-12
            xl:text-[16px] xl:mt-[6px] xl:ml-7
            lg:text-[14px] lg:mt-[6px] lg:ml-[26px]
            md:text-[13px] md:mt-1 md:ml-6
            sm:text-[11px] sm:mt-[2px] sm:ml-5
            text-[10px] mt-[0px] ml-4 capitalize
            "
            >
              Category:
            </label>

            <select
 type="text"
 name="category"
 className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none relative w-10/12  lg:w-8/12
  2xl:text-[20px] 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
  xl:text-[16px] xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
 lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
 md:text-[13px] md:m-4 md:px-3 md:py-1 md:h-[30px]

 sm:text-[12px] sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
 text-[12px] m-2 px-2 py-1 h-[25px]
 "
 // defaultValue={editData?.category?.title}
 value={categoryDetails?.category}
 onChange={inputHandler}
 required
 max={84}
>
 <option value="" disabled>
   Select Category
 </option>
 {getallCategory?.map((item, index) => (
   <option key={item?._id} value={item?._id}>
     {item?.title}
   </option>
 ))}
</select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="border bg-blue-500 hover:bg-blue-600 text-white md:rounded-lg bg-lightBlue-600  2xl:text-[20px] 2xl:p-2 2xl:m-10 2xl:mt-0
              xl:text-[14px] xl:py-2 xl:px-4  xl:m-5 xl:mt-0
              lg:text-[12px] lg:py-2 lg:px-3 lg:m-5 lg:mt-0
              md:text-[12px] md:py-1 md:px-2 md:m-4 md:mt-0
              sm:text-[11px] sm:py-1  sm:px-1 sm:m-3 sm:mt-0
              text-[10px] py-[3px] px-1 m-2 mt-0 rounded-md
               "
          >
            {isLoading ? "Loading." : "Update"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditSubCategory;
