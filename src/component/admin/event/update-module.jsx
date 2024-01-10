import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import Image from "next/image";

const EditEvent = ({ editData, editEvent, closeDrawer, refreshData }) => {
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
  const [isLoading, setLoading] = useState(false);
  const [getallCategory, setGetallCategory] = useState([]);
  const [getallSubCategory, setGetallSubCategory] = useState([]);
  const [eventDetail, setEventDetail] = useState(editData);

  const [eventImage, setEventImage] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [openImgPopup, setOpenImgPopup] = useState(false);
  const [imageDisable, setImageDisable] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);

  // console.log("edit", editData.images);

  const inputHandler = (e) => {
    if (e.target.name === "images") {
      setEventImage({ file: e.target.files[0] });
    } else {
      setEventDetail({ ...eventDetail, [e.target.name]: e.target.value });
    }
  };

  // --------image update --------
  const showImage = (img) => {
    setImgUrl(img);
    setOpenImgPopup(true);
  };

  const handleRemoveImage = (id) => {
    let newImage =
      eventDetail?.images?.length > 0 &&
      eventDetail?.images?.filter((items, index) => {
        return items?._id !== id;
      });
    setEventDetail({ ...eventDetail, [`images`]: newImage });
    setImageDisable(false);
    refreshData();
  };
  // console.log(eventDetail)

  const uploadImage = async (e) => {
    setImageUpload(true);

    if (eventImage == "" || eventImage == undefined) {
      setImageUpload(false);
      return toast.warn("Please upload image.");
    }

    try {
      const response = await axios.post("/api/auth/uploadImage", eventImage, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // console.log('Category added:', response?.data);
        setEventDetail({ ...eventDetail, ["image"]: response?.data?.url });
        setImageDisable(true);
        setImageUpload(false);
      } else {
        setEventDetail({ ...eventDetail, ["image"]: "" });
        setImageDisable(false);
        setImageUpload(false);
      }
    } catch (error) {
      console.error("Error adding category:", error?.response?.data);
      setImageUpload(false);
    }
  };

  const addField = async (e) => {
    setImageDisable(false);
    setEventImage("");
  };

  // --------image update end--------

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`/api/event/updateEvent`, eventDetail, {
        headers: {
          "Content-Type": "application/json",
          authorization: auth_token,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        refreshData();
        toast.success("Update successfully!");
        closeDrawer();
      } else {
        setLoading(false);
        toast.error("server error");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "server error");
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
          {/* ------1.Event Name----- */}
          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event Name
            </label>
            <input
              defaultValue={editData?.name ? editData?.name : eventDetail?.name}
              required
              type="text"
              name="name"
              onChange={inputHandler}
              className="custom_input"
            />
          </div>
          {/* ------2. Event description----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event Description
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.description}
              type="text"
              name="description"
              className="custom_input"
              required
            />
          </div>
          {/* ------3. Event startDate----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event StartDate
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.startDate}
              type="datetime-local"
              name="startDate"
              className="custom_input"
              required
            />
          </div>
          {/* ------4. Event endDate----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event EndDate
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.endDate}
              type="datetime-local"
              name="endDate"
              className="custom_input"
              required
            />
          </div>
          {/* ------5. Event location----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event Location
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.location}
              type="text"
              name="location"
              className="custom_input"
              required
            />
          </div>
          {/* ------6.Event city----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event City
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.city}
              type="text"
              name="city"
              className="custom_input"
              required
            />
          </div>

          {/* ------7. Event country----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event Country
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.country}
              type="text"
              name="country"
              className="custom_input"
              required
            />
          </div>
         
          {/* ------10. Event price----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event Price
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.price}
              type="text"
              name="price"
              className="custom_input"
              required
            />
          </div>
          {/* ------11. Event currency----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event Currency
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.currency}
              type="text"
              name="currency"
              className="custom_input"
              required
            />
          </div>
          {/* ------12. Event category----- */}

          <div className="w-1/2 grid grid-cols-6 gap-1 sm:gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-4 sm:mt-0  sm:mb-2 md:mb-3 lg:mb-4  xl:mb-6">
            <label htmlFor="" className="custom_input_label">
              Event Category
            </label>

            <div className="col-span-8 sm:col-span-4 ml-2 sm:ml-0 w-full">
              <select
                name="category"
                className="custom_input w-full"
                defaultValue={
                  editData?.category ? editData?.category?._id : eventDetail?.category
                }
                onChange={inputHandler}
                required
                minLength={3}
                maxLength={32}
              >
                {/* <option value="" disabled>
                  {editData?.category
                    ? editData?.category?._id
                    : eventDetail?.category}
                </option> */}
                {getallCategory.map((item) => (
                  <option
                    className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                    key={item._id}
                    value={item._id}
                    // selected={
                    //   item._id === (editData?._id || eventDetail?.category)
                    // }
                  >
                    {item?.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* ------13. Event subCategory----- */}

          <div className="w-1/2 grid grid-cols-6 gap-1 sm:gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-4 sm:mt-0  sm:mb-2 md:mb-3 lg:mb-4  xl:mb-6">
            <label htmlFor="" className="custom_input_label">
              Event SubCategory
            </label>

            <div className="col-span-8 sm:col-span-4 ml-2 sm:ml-0 w-full">
              <select
                name="subCategory"
                className="custom_input w-full"
                defaultValue={
                  editData?.subCategory
                    ? editData?.subCategory?._id
                    : eventDetail?.subCategory
                }
                onChange={inputHandler}
                required
                minLength={3}
                maxLength={32}
              >
                {/* <option value="" disabled>
                  {editData?.subCategory
                    ? editData?.subCategory
                    : eventDetail?.subCategory}
                </option> */}
                {getallSubCategory
                  .filter((item, indr) => {
                    return item?.title === eventDetail?.title;
                  })
                  .map((item) => (
                    <option
                      className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                      key={item?._id}
                      value={item?._id}
                      // selected={
                      //   item?.subCategory ===
                      //   (editData?.subCategory || eventDetail?.subCategory)
                      // }
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
              className="custom_input_label
          "
            >
              Event Capacity
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.capacity}
              type="text"
              name="capacity"
              className="custom_input"
              required
            />
          </div>
          {/* ------15. Event resource_url----- */}

          <div className="w-1/2">
            <label
              className="custom_input_label
          "
            >
              Event URL
            </label>
            <input
              onChange={inputHandler}
              defaultValue={editData?.resource_url}
              type="text"
              name="resource_url"
              className="custom_input"
              required
            />
          </div>
          {/* ------16. Event image----- */}

          {eventDetail?.images?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-2 w-1/2 2xl:px-10 lg:px-5 px-4 ">
                {eventDetail?.images?.map((item, inx) => (
                  <>
                  {console.log(item)}
                    <div className="flex gap-2 items-center ">
                      <p
                        className="underline md:text-[18px] text-[16px] font-[400] px-4 cursor-pointer"
                        onClick={() => showImage(item?.url)}
                      >
                        Image {inx + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(item?._id)}
                        className="text-[14px] font-[400] text-[red] hover:bg-[#efb3b38a]"
                      >
                        X
                      </button>
                    </div>
                  </>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 mt-2 w-1/2">
              <input
                id="file"
                type="file"
                name="images"
                disabled={imageDisable}
                onChange={inputHandler}
                className="w-full  border max-w-[250px]"
                accept="image/png,image/jpg, image/jpeg , image/*"
              />

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
                                        ? "bg-[green]"
                                        : "bg-[#070708bd]"
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
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="custom_btn"
          >
            {isLoading ? "Loading." : "Update"}
          </button>
        </form>
      </div>

      {/*---------- Add popup---------- */}
      <Transition appear show={openImgPopup} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[1111]"
          onClose={() => setOpenImgPopup(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-[400px] transform overflow-hidden rounded-2xl bg-white py-10 px-2 md:px-12 text-left align-middle shadow-xl transition-all">
                  <div
                    className="absolute right-5 top-5 cursor-pointer text-[16px] font-bold"
                    onClick={() => setOpenImgPopup(false)}
                  >
                    X
                  </div>
                  <div className="px-5 py-4">
                    <Image
                       src={`/utils?url=${encodeURIComponent(imgUrl)}`}
                      alt="loading.."
                      height={300}
                      width={300}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditEvent;
