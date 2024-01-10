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

  const accessTokenString = localStorage.getItem("accessToken");
  const auth_token = accessTokenString ? JSON.parse(accessTokenString) : null;
  const [eventDetail, setEventDetail] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    city: "",
    country: "",
    // latitude: "",
    // longitude: "",
    price: "",
    currency: "",
    category: "",
    subCategory: "",
    capacity: "",
    images: [],
    resource_url: "",
  });
  // console.log(eventDetail.image, "token");
  const [eventImage, setEventImage] = useState("");
  const [imageDisable, setImageDisable] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = today.getDate().toString().padStart(2, "0");
  const formattedToday = `${year}-${month}-${day}T00:00`;
  // console.log(formattedToday)
  const refreshData = () => {
    setEventDetail({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      city: "",
      country: "",
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
    if (e.target.name === "images") {
      setEventImage({ file: e.target.files[0] });
    } else {
      setEventDetail({
        ...eventDetail,
        [name]: value,
      });
    }
  };

  const addField = (e) => {
    setImageDisable(false);
    setEventImage("");
  };

  const uploadImage = async () => {
    // alert("okk")
    setImageUpload(true);

    if (eventImage == "" || eventImage == undefined) {
      setImageUpload(false);
      return toast.warn("Please upload image.");
    }

    try {
      const response = await axios.post("/api/auth/uploadImage", eventImage, {
        headers: {
          authorization: auth_token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // console.log('Category added:', response?.data);
        // setEventDetail({
        //   ...eventDetail,
        //   images: [...eventDetail.images, response?.data?.url],
        // });
        const newImage = { url: response?.data?.url };
        setEventDetail({
          ...eventDetail,
          images: [...eventDetail?.images, newImage],
        });
  
        setImageDisable(true);
        setImageUpload(false);
        // setSubmited(true);
      } else {
        setEventDetail({ ...eventDetail, ["images"]: "" });
        setImageDisable(false);
        setImageUpload(false);
      }
    } catch (error) {
      console.error("Error adding category:", error?.response?.data);
      setImageUpload(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   if (eventDetail?.images?.length<1 ) {
  //     toast.warn("Please upload atleast 1 image");
  //   } else {
  //     try {
  //       await fetch("/api/event/createEvent", {
  //         method: "POST",
  //         headers: {
  //           "content-type": "application/json",
  //           authorization: auth_token,
  //         },
  //         body: JSON.stringify(eventDetail),
  //       })
  //         .then((res) => {
  //           if (res.status === 201) {
  //             refreshData();
  //             closeDrawer();
  //             setLoading(false);
  //             toast.success("Submit successfully!");
  //           } else {
  //             setLoading(false);
  //             return;
  //           }
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //           setLoading(false);
  //         });
  //     } catch (error) {
  //       console.error(error);
  //       toast.error(error?.response?.data?.messgae || "server error");
  //       setLoading(false);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (eventDetail?.images?.length < 1) {
      toast.warn("Please upload atleast 1 image");
    } else {
      try {
        const response = await axios.post(
          `/api/event/createEvent`,
          JSON.stringify(eventDetail),
          {
            headers: {
              "content-type": "application/json",
              authorization: auth_token,
            },
          }
        );

        if (response.status === 201) {
          refreshData();
          closeDrawer();
          setLoading(false);
          toast.success("Submit successfully!");
        } else {
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.messgae || "server error");
        setLoading(false);
      }
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
          <label className="custom_input_label" >
            Event Name
          </label>
          <input
            value={eventDetail.name}
            onChange={inputHandler}
            maxLength={100}
            required
            type="text"
            name="name"
            className="custom_input" />
        </div>
        {/* ------2. Event description----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event Description
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.description}
            type="text"
            name="description"
            className="custom_input"  
             required
            maxLength={300}
          />
        </div>
        {/* ------3. Event startDate----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event StartDate
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.startDate}
            type="datetime-local"
            name="startDate"
            className="custom_input"   required
            min={formattedToday}
            // max={maxDatetime}
          />
        </div>
        {/* ------4. Event endDate----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event EndDate
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.endDate}
            type="datetime-local"
            name="endDate"
            className="custom_input"   required
            min={eventDetail?.startDate || formattedToday}
          />
        </div>
        {/* ------5. Event location----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event Location
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.location}
            type="text"
            name="location"
            className="custom_input"   required
            maxLength={200}
          />
        </div>
        {/* ------6.Event city----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event City
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.city}
            type="text"
            name="city"
            className="custom_input"   required
            maxLength={64}
          />
        </div>

        {/* ------7. Event country----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event Country
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.country}
            type="text"
            name="country"
            className="custom_input"   required
            maxLength={64}
          />
        </div>
       
        {/* ------10. Event price----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event Price
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.price}
            type="text"
            name="price"
            className="custom_input"   required
            pattern="[0-9]*"
            title="Please enter only numbers"
          />
        </div>
        {/* ------11. Event currency----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event Currency
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.currency}
            type="text"
            name="currency"
            className="custom_input"   required
          />
        </div>
        {/* ------12. Event category----- */}

        <div className="w-1/2">
          <label  htmlFor="category" className="custom_input_label" >
            Event Category
          </label>

          <div className="">
            <select
              name="category"
              className="custom_input w-10/12 lg:w-8/12"
              onChange={inputHandler}
              required
              maxLength={64}
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
          <label htmlFor=""  className="custom_input_label" >
            Event SubCategory
          </label>

          <div className="">
            <select
              name="subCategory"
              className="custom_input w-10/12 lg:w-8/12"
              onChange={inputHandler}
              required
              maxLength={64}
            >
              <option value="">Select SubCategory</option>
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
          <label className="custom_input_label" >
            Event Capacity
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.capacity}
            type="text"
            name="capacity"
            className="custom_input"   required
            pattern="[0-9]*"
            title="Please enter only numbers"
          />
        </div>
        {/* ------15. Event resource_url----- */}

        <div className="w-1/2">
          <label className="custom_input_label" >
            Event URL
          </label>
          <input
            onChange={inputHandler}
            value={eventDetail.resource_url}
            type="text"
            name="resource_url"
            className="custom_input"   required
          />
        </div>
        {/* ------16. Event image----- */}

        <div className="2xl:m-10 lg:m-5 md:m-4 sm:m-3">
          <div className="py-2 flex items-end gap-x-10 ">
            <div className="">
              <span className="login-input-label cursor-pointer mb-2">
                Picture
              </span>
              <div className="flex items-center w-full">
                <input
                  id="file"
                  type="file"
                  name="images"
                  disabled={imageDisable}
                  onChange={inputHandler}
                  className="w-full text-black border text-[13px] hover:white max-w-[200px] mt-2"
                  accept="image/png,image/jpg, image/jpeg , image/*"
                />
              </div>
            </div>

            <div className="">
              {imageDisable ? (
                <button
                  className="p-2 border h-[20px] flex justify-center items-center"
                  type="button"
                  onClick={addField}
                >
                  +
                </button>
              ) : (
                <button
                  className={`focus-visible:outline-none  text-white text-[13px] px-4 py-1 rounded
                    ${
                      imageDisable
                        ? " bg-[green]"
                        : imageUpload
                        ? "bg-[gray]"
                        : "bg-[#070708] text-[white]"
                    }`}
                  type="button"
                  onClick={uploadImage}
                  disabled={imageDisable || imageUpload}
                >
                  {imageDisable
                    ? "Uploaded"
                    : imageUpload
                    ? "Loading.."
                    : "Upload"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="custom_btn"
          >
            Add Event
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateEvent;
