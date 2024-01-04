import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const EditEvent = ({ editData, editEvent, closeDrawer, refreshData }) => {
  const auth_token = JSON.parse(localStorage.getItem("accessToken"));
  const [isLoading, setLoading] = useState(false);
  const [getallCategory, setGetallCategory] = useState([]);
  const [getallSubCategory, setGetallSubCategory] = useState([]);

  const [eventDetail, setEventDetail] = useState({
    name: editData?.name || "",
    description: editData?.description || "",
    startDate: editData?.startDate || "",
    endDate: editData?.endDate || "",
    location: editData?.location || "",
    city: editData?.city || "",
    country: editData?.country || "",
    latitude: editData?.latitude || "",
    longitude: editData?.longitude || "",
    price: editData?.price || "",
    currency: editData?.currency || "",
    category: editData?.category || "",
    subCategory: editData?.subCategory || "",
    capacity: editData?.capacity || "",
    image: editData?.image || "",
    resource_url: editData?.resource_url || "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setEventDetail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:4000/api/event/updateEvent`,
        eventDetail,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth_token,
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        closeDrawer();
        refreshData();
      } else {
        setLoading(false);
        console.error("Server error!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Server error:", error);
    }
  };

  useEffect(() => {
    defaultCategory();
  }, []);

  const defaultCategory = () => {
    const option = {
      method: "GET",
      url: "http://localhost:4000/api/category/getallCategory",
    };
    axios
      .request(option)
      .then((response) => {
        setGetallCategory(response?.data);
        console.log("herry", response?.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    defaultSubCategory();
  }, []);

  const defaultSubCategory = () => {
    const option = {
      method: "GET",
      url: "http://localhost:4000/api/subCategory/getallSubCategory",
    };
    axios
      .request(option)
      .then((response) => {
        setGetallSubCategory(response?.data);
        console.log("herry", response?.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
        <h2 className="2xl:text-[22px] xl:text-[18px] lg:text-[16px] md:text-[14px] sm:text-[12px] text-[10px] font-semibold ">
          Edit Event{" "}
        </h2>
        <div className="mb-3 w-[40%]"></div>
      </div>
      <div>
        <form
          onSubmit={handleUpdateCategory}
          className="flex flex-wrap bg-white border  rounded-lg 2xl:p-2 xl:p-2  lg:p-1 md:p-2 p-1  mx-auto"
        >
          {/* <div className="mt-2">
            <label
              className="absolute bg-white z-20 text-gray-800
            2xl:text-[20px] 2xl:mt-5 2xl:ml-12
            xl:text-[16px] xl:mt-[6px] xl:ml-7
            lg:text-[14px] lg:mt-[6px] lg:ml-[26px]
            md:text-[13px] md:mt-1 md:ml-6
            sm:text-[11px] sm:mt-[2px] sm:ml-5
            text-[10px] mt-[0px] ml-4
            "
            >
              Event
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.name}
              defaultValue={editData?.title}
              type="text"
              name="name"
              className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none relative w-10/12  lg:w-8/12
               2xl:text-[20px] 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
               xl:text-[16px] xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
              lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
              md:text-[13px] md:m-4 md:px-3 md:py-2 md:h-[30px]
              sm:text-[12px] sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
              text-[12px] m-2 px-2 py-1 h-[25px]
              "
              required
            />
          </div> */}
          {/* ------1.Event Name----- */}
          <div className="w-1/2">
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
              Event Name
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.name ? editData?.name : eventDetail.name}
              required
              type="text"
              name="name"
              className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none relative w-10/12  lg:w-8/12 2xl:text-sm 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
            xl:text-md xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
            lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
            md:text-sm md:m-4 md:px-3 md:py-2 md:h-[30px]
            sm:text-sm sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
            text-sm m-2 px-2 py-1 h-[20px]
            "
            />
          </div>
          {/* ------2. Event description----- */}

          <div className="w-1/2">
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
              Event Description
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.description}
              type="text"
              name="description"
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
          {/* ------3. Event startDate----- */}

          <div className="w-1/2">
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
              Event StartDate
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.startDate}
              type="text"
              name="startDate"
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
          {/* ------4. Event endDate----- */}

          <div className="w-1/2">
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
              Event EndDate
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.endDate}
              type="text"
              name="endDate"
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
          {/* ------5. Event location----- */}

          <div className="w-1/2">
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
              Event Location
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.location}
              type="text"
              name="location"
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
          {/* ------6.Event city----- */}

          <div className="w-1/2">
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
              Event City
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.city}
              type="text"
              name="city"
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

          {/* ------7. Event country----- */}

          <div className="w-1/2">
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
              Event Country
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.country}
              type="text"
              name="country"
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
          {/* ------8. Event latitude----- */}

          <div className="w-1/2">
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
              Event Latitude
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.latitude}
              type="text"
              name="latitude"
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
          {/* ------9. Event longitude----- */}

          <div className="w-1/2">
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
              Event Longitude
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.longitude}
              type="text"
              name="longitude"
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
          {/* ------10. Event price----- */}

          <div className="w-1/2">
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
              Event Price
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.price}
              type="text"
              name="price"
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
          {/* ------11. Event currency----- */}

          <div className="w-1/2">
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
              Event Currency
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.currency}
              type="text"
              name="currency"
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
          {/* ------12. Event category----- */}

          <div className="w-1/2">
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
              Event Category
            </label>
            <div className="col-span-8 sm:col-span-4 ml-2 sm:ml-0">
              <select
                name="category"
                className="custom-input 2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                defaultValue={
                  editData?.category ? editData.category : eventDetail.category
                }
                onChange={inputHandler}
                required
                minLength={3}
                maxLength={32}
              >
                <option value="" disabled>
                  {editData?.category
                    ? editData.category
                    : eventDetail.category}
                </option>
                {getallCategory.map((item) => (
                  <option
                    className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                    key={item.id}
                    value={item.title}
                    selected={
                      item.title ===
                      (editData?.category || eventDetail.category)
                    }
                  >
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* ------13. Event subCategory----- */}

          <div className="grid grid-cols-6 gap-1 sm:gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-4 sm:mt-0  sm:mb-2 md:mb-3 lg:mb-4  xl:mb-6 w-1/2">
            <label
              htmlFor=""
              className="custom-input-label 2xl:text-[20px] xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[12px] px-2 md:px-3 lg:px-4 xl:px-5 2xl:px-0"
            >
              Product Sub Category
            </label>
            <div className="col-span-8 sm:col-span-4 ml-2 sm:ml-0">
              <select
                name="subCategory"
                className="custom-input 2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                defaultValue={
                  editData?.subCategory
                    ? editData.subCategory
                    : eventDetail.subCategory
                }
                onChange={inputHandler}
                required
                minLength={3}
                maxLength={32}
              >
                <option value="" disabled>
                  {editData?.subCategory
                    ? editData.subCategory
                    : eventDetail.subCategory}
                </option>
                {getallSubCategory
                  .filter((item, indr) => {
                    return item?.category?.title === eventDetail.category;
                  })
                  .map((item) => (
                    <option
                      className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                      key={item.id}
                      value={item.title}
                      selected={
                        item.title ===
                        (editData?.title || eventDetail.subCategory)
                      }
                    >
                      {item?.subCategory}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {/* ------14. Event capacity----- */}

          <div className="w-1/2">
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
              Event Capacity
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.capacity}
              type="text"
              name="capacity"
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
          {/* ------15. Event resource_url----- */}

          <div className="w-1/2">
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
              Event URL
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.resource_url}
              type="text"
              name="resource_url"
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
          {/* ------16. Event image----- */}

          <div className="w-1/2">
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
              Event Image
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.image}
              type="text"
              name="image"
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
            disabled={isLoading}
            className="border bg-blue-600 text-white  rounded-lg bg-lightBlue-600  2xl:text-[20px] 2xl:p-2 2xl:m-10 2xl:mt-0
              xl:text-[14px] xl:py-2 xl:px-4  xl:m-5 xl:mt-0
              lg:text-[12px] lg:py-2 lg:px-3 lg:m-5 lg:mt-0
              md:text-[12px] md:py-1 md:px-2 md:m-4 md:mt-0
              sm:text-[11px] sm:py-1  sm:px-1 sm:m-3 sm:mt-0
              text-[10px] py-[3px] px-1 m-2 mt-0
               "
          >
            {isLoading ? "Loading." : "Update"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditEvent;
