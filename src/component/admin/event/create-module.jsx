"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import axios from "axios";

const CreateEvent = ({ closeDrawer }) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [getallSubCategory, setGetallSubCategory] = useState([]);
  const [getallCategory, setGetallCategory] = useState([]);

  const auth_token = JSON.parse(localStorage.getItem("accessToken"));
  console.log(auth_token, "token");
  const [eventDetail, setEventDetail] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    price: "",
    currency: "",
    category: "",
    subCategory: "",
    capacity: "",
    image: "",
    resource_url: "",
  });

  const refreshData = () => {
    setEventDetail({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      city: "",
      country: "",
      latitude: "",
      longitude: "",
      price: "",
      currency: "",
      category: "",
      subCategory: "",
      capacity: "",
      image: "",
      resource_url: "",
    });
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setEventDetail({
      ...eventDetail,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/event/createEvent", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: auth_token,
        },
        body: JSON.stringify(eventDetail),
      })
        .then((res) => {
          if (res.ok) {
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

  useEffect(() => {
    defaultCategory();
  }, []);

  const defaultCategory = () => {
    const option = {
      method: "GET",
      url: "/api/category/getallCategory",
    };
    axios
      .request(option)
      .then((response) => {
        setGetallCategory(response?.data);
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
      url: "/api/subCategory/getallSubCategory",
    };
    axios
      .request(option)
      .then((response) => {
        setGetallSubCategory(response?.data);
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
        <h2 className="2xl:text-2xl xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[10px] text-[9px] font-semibold ">
          Add New Event{" "}
        </h2>
        <div className="mb-3 w-[40%]"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" flex flex-wrap bg-white border  rounded-lg 2xl:p-2 xl:p-2  lg:p-1 md:p-2 p-1  mx-auto"
      >
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
            value={eventDetail.name}
            onChange={inputHandler}
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
            value={eventDetail.description}
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
            value={eventDetail.startDate}
            type="datetime-local"
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
            value={eventDetail.endDate}
            type="datetime-local"
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
            value={eventDetail.location}
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
            value={eventDetail.city}
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
            value={eventDetail.country}
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
            value={eventDetail.latitude}
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
            value={eventDetail.longitude}
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
            value={eventDetail.price}
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
            value={eventDetail.currency}
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
            htmlFor="category"
            className="absolute bg-white z-20 text-gray-800 2xl:text-[18px] 2xl:mt-6 2xl:ml-14 xl:text-[14px] xl:mt-2 xl:ml-8 lg:text-[12px] lg:mt-[10px] lg:ml-[26px] md:text-[10px] md:mt-2 md:ml-6 sm:text-[9px] sm:mt-1 sm:ml-5 text-[8px] mt-[2px] ml-4"
          >
            Event Category
          </label>

          <div className="">
            <select
              name="category"
              className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 2xl:text-sm 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px] xl:text-md xl:m-5 xl:px-3 xl:py-1 xl:h-[40px] lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px] md:text-sm md:m-4 md:px-3 md:py-2 md:h-[30px] sm:text-sm sm:m-3 sm:px-2 sm:py-1 sm:h-[30px] text-sm m-2 px-2 py-1 h-[20px] w-10/12 lg:w-8/12"
              onChange={inputHandler}
              required
              minLength={3}
              maxLength={32}
            >
              <option value="">Select Category</option>
              {getallCategory.map((item) => (
                <option
                  key={item.id}
                  value={item._id}
                  selected={item._id === eventDetail.title}
                  className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                >
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ------13. Event subCategory----- */}

        <div className="w-1/2 ">
          <label
            htmlFor=""
            className="absolute bg-white z-20 text-gray-800
          2xl:text-[18px] 2xl:mt-6 2xl:ml-14
          xl:text-[14px] xl:mt-2 xl:ml-8
          lg:text-[12px] lg:mt-[10px] lg:ml-[26px]
          md:text-[10px] md:mt-2 md:ml-6
          sm:text-[9px] sm:mt-1 sm:ml-5
          text-[8px] mt-[2px] ml-4"
          >
            Event SubCategory
          </label>

          <div className="">
            <select
              name="subCategory"
              className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600  focus:outline-none relative  2xl:text-sm 2xl:m-10 2xl:px-3 2xl:py-2 2xl:h-[50px]
            xl:text-md xl:m-5 xl:px-3 xl:py-1 xl:h-[40px]
            lg:text-sm lg:m-5 lg:px-2 lg:py-1 lg:h-[35px]
            md:text-sm md:m-4 md:px-3 md:py-2 md:h-[30px]
            sm:text-sm sm:m-3 sm:px-2 sm:py-1 sm:h-[30px]
            text-sm m-2 px-2 py-1 h-[20px] w-10/12  lg:w-8/12"
              onChange={inputHandler}
              required
              minLength={3}
              maxLength={32}
            >
              <option value="" >
                Select SubCategory
              </option>
              {getallSubCategory.map((item) => (
                <option
                  key={item.id}
                  value={item._id}
                  selected={item._id === eventDetail.subCategory}
                  className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                >
                  {item.subCategory}
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
            value={eventDetail.capacity}
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
            value={eventDetail.resource_url}
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
            value={eventDetail.image}
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
          className="border bg-blue-500 hover:bg-blue-600 text-white lg:rounded-lg bg-lightBlue-600 2xl:text-[20px] 2xl:p-2 2xl:m-10 2xl:mt-0
            xl:text-[14px] xl:p-2 xl:m-5 xl:mt-0
            lg:text-[12px] lg:p-2 lg:m-5 lg:mt-0
            md:text-[11px] md:p-[6px] md:m-4 md:mt-0
            sm:text-[10px] sm:p-1 sm:m-3 sm:mt-0
            text-[9px] p-1 m-2 mt-0 rounded-md
             "
        >
          Add Event
        </button>
      </form>
    </>
  );
};

export default CreateEvent;
