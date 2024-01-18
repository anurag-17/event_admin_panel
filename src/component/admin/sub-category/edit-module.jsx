import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../contexts/AuthContext";

const EditSubCategory = ({ editData, cateEdit, closeDrawer, refreshData,isLoadingBtn, getallCategory }) => {
  const [isLoading, setLoading] = useState(false);
  const { adminAuthToken } = useAuth();

  const [categoryDetails, setCategoryDetails] = useState({
    id: cateEdit,
    category: editData?.category?._id || "",
    subCategory: editData?.subCategory || "",
  });

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
      const { status } = await axios.put(
        "/api/subCategory/updateSubCategory",
        categoryDetails,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: adminAuthToken,
          },
        }
      );
  
      if (status === 200) {
        toast.success("SubCategory Updated Successfully!");
        closeDrawer();
        refreshData();
      } else {
        toast.error("Failed to update SubCategory. Server error!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed. Something went wrong!");
    } finally {
      setLoading(false);
    };
  };
  

  return (
    <>
     <div className="flex justify-between items-center border border-[#f3f3f3] rounded-lg bg-white px-1 h-[25px] my-2">
        <h2 className="text-[10px] font-semibold">Edit Sub-Category</h2>
        <div className="mb-3 w-[40%]"></div>
      </div>

      <div>
        <form onSubmit={handleUpdateCategory} className="bg-white border rounded-lg 2xl:p-2 xl:p-2 lg:p-1 md:p-2 p-1 mx-auto">
          <div>
            <label className="custom_input_label">Sub Category</label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.subCategory}
              type="text"
              name="subCategory"
              className="custom_input capitalize"
              required
              maxLength={84}
            />
          </div>

          <div>
            <label className="custom_input_label">Category:</label>
            <select
              type="text"
              name="category"
              className="custom_input"
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
                    getallCategory?.map((item) => (
                      <option key={item?._id} value={item?._id}>
                        {item?.title}
                      </option>
                    ))}
                </>
              )}
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="custom_btn">
            {isLoading ? "Loading..." : "Update"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditSubCategory;
