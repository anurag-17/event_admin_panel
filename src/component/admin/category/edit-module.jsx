import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";

const EditCate = ({ editData, cateEdit, closeDrawer, refreshData }) => {
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState({
    id: cateEdit,
  });
  const { adminAuthToken } = useAuth();

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setTitle({
      ...title,
      ["title"]: value,
    });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`/api/category/updateCategory`, title, {
        headers: {
          "content-Type": "application/json",
          authorization: adminAuthToken,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        toast.success("Category Update Successfully!");
        closeDrawer();
        refreshData();
      } else {
        setLoading(false);
        toast.error("Server error !");
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
        className="flex justify-center items-center border border-[#f3f3f3] rounded-lg bg-white
        2xl:px-5  2xl:h-[50px] 2xl:my-5
        xl:px-4  xl:h-[40px] xl:my-4
        lg:px-3  lg:h-[35px] lg:my-2
        md:px-2  md:h-[30px] md:my-2
        sm:px-1 sm:h-[25px] sm:my-2
        px-1 h-[25px] my-2
         "
      >
        <h2 className="custom_heading_text font-semibold ">
          Edit Category{" "}
        </h2>
        
      </div>
      <div>
        <form
          onSubmit={handleUpdateCategory}
          className=" bg-white border  rounded-lg 2xl:p-2 xl:p-2  lg:p-1 md:p-2 p-1  mx-auto"
        >
          <div className="mt-2">
            <label
              className="custom_input_label"
            >
              Category
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.title}
              type="text"
              name="name"
              className="custom_inputt capitalize"
              required
              maxLength={84}
            />
          </div>
         <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="custom_btn"
          >
            {isLoading ? "Loading." : "Update"}
          </button></div>
        </form>
      </div>
    </>
  );
};

export default EditCate;
