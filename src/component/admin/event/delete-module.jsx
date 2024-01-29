import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const DeleteEvent = ({ eventID, closeModal, refreshData }) => {
  const [isLoading, setLoading] = useState(false);
  const { adminAuthToken } = useAuth();

  const handleClose = () => {
    closeModal();
    // refreshData();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setLoading(true);

    const options = {
      method: "DELETE",
      url: "/api/event/deleteEvent",
      data: {
        id: eventID,
      },
      headers: {
        Accept: "application/json",
        authorization: adminAuthToken,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          setLoading(false);
          closeModal();
          refreshData();
        } else {
          setLoading(false);
          return;
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
        toast.error("Failed. something went wrong!");
      });
  };

  return (
    <>
         <div className="mt-2">
        <p className="text-[12px] sm:text-[16px] font-normal ms:leading-[30px] text-gray-500 mt-4">
          Do you really want to delete these records? You Can't view this in
          your list anymore if you delete!
        </p>
      </div>

      <div className="mt-8">
        <div className="flex justify-between gap-x-5">
          <button
            className="w-full rounded-md border-lightBlue-400 text-lightBlue-700 hover:bg-lightBlue-200
                              hover:border-none  border-sky-400 text-sky-700 hover:bg-sky-200 custom_btn_d "
            onClick={handleClose}
          >
            No, Keep It
          </button>
          {isLoading ? (
            <button
              className="w-full
               rounded-md 
              custom_btn_d 
                              border-red-400 text-red-700 bg-red-200  
                              hover:border-none"
            >
              Loading...
            </button>
          ) : (
            <button
              // onClick={productDelete(id)}
              className="w-full
               rounded-md 
              custom_btn_d 
                              border-red-400 text-red-700 hover:bg-red-200  
                              
                              hover:border-none"
              onClick={handleDelete}
            >
              Yes, Delete It
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DeleteEvent;
