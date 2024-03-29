import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const EditEvent = ({ editData, closeModal, refreshData }) => {
  const { adminAuthToken } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [getallCategory, setGetallCategory] = useState([]);
  const [getallSubCategory, setGetallSubCategory] = useState([]);
  const [eventDetail, setEventDetail] = useState(editData);
  const [eventImage, setEventImage] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [openImgPopup, setOpenImgPopup] = useState(false);
  const [imageDisable, setImageDisable] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);

  const inputHandler = (e) => {
    if (e.target.name === "images") {
      setEventImage({ file: e.target.files[0] });
    } else {
      setEventDetail({ ...eventDetail, [e.target.name]: e.target.value });
    }
  };

  //-------handle cover image-------
  const handleCoverImageChange = (newPosition) => {
    const newIndex =
      eventDetail?.images?.length > 0 &&
      eventDetail?.images?.findIndex(
        (image) => image?.position === newPosition
      );

    const currentIndex = eventDetail?.images.findIndex(
      (image) => image?.position === 0
    );

    if (newIndex !== -1 && currentIndex !== -1) {
      const newImages = [...eventDetail?.images];

      newImages[currentIndex].position = newPosition;
      newImages[newIndex].position = 0;

      setEventDetail({ ...eventDetail, ["images"]: newImages });
    } else {
      console.error("Invalid positions provided.");
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
      eventDetail?.images?.filter((items) => {
        return items?._id !== id;
      });
    setEventDetail({ ...eventDetail, [`images`]: newImage });
    setImageDisable(false);
    // refreshData();
  };

  const uploadImage = async (e) => {
    setImageUpload(true);

    if (eventImage == "" || eventImage == undefined) {
      setImageUpload(false);
      return toast.warn("Please upload image.");
    } else {
      try {
        const response = await axios.post("/api/auth/uploadImage", eventImage, {
          headers: {
            Authorization: adminAuthToken,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          const newImage = {
            url: response?.data?.url,
            position: eventDetail?.images?.length,
          };
          const updatedImages = eventDetail.images.map((image, index) => ({
            ...image,
            position: index,
          }));

          setEventDetail({
            ...eventDetail,
            images: [...updatedImages, newImage],
          });
          setImageDisable(true);
          setImageUpload(false);
        } else {
          setEventDetail({ ...eventDetail, ["images"]: "" });
          setImageDisable(false);
          setImageUpload(false);
        }
      } catch (error) {
        console.error("Error", error);
        setImageUpload(false);
      }
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
          authorization: adminAuthToken,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        refreshData();
        toast.success("Update successfully!");
        closeModal();
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
        setGetallCategory(response?.data?.categories);
        // setGetallCategory(response?.data);
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
        setGetallSubCategory(response?.data?.subCategories);
        // setGetallSubCategory(response?.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  console.log(eventDetail);

  return (
    <>
      <div className="h-[400px] xl:h-[480px] 2xl:h-[570px] overflow-auto relative">
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
                defaultValue={
                  editData?.name ? editData?.name : eventDetail?.name
                }
                required
                type="text"
                name="name"
                onChange={inputHandler}
                className="custom_inputt "
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
                className="custom_inputt"
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
                defaultValue={
                  editData?.startDate
                    ? new Date(editData.startDate).toISOString().slice(0, 16)
                    : ""
                }
                type="datetime-local"
                name="startDate"
                className="custom_inputt"
                required
              />
            </div>
            {/* ------4. Event endDate----- */}

            <div className="w-1/2">
              <label className="custom_input_label">Event EndDate</label>

              <input
                onChange={inputHandler}
                defaultValue={
                  editData?.startDate
                    ? new Date(editData.endDate).toISOString().slice(0, 16)
                    : ""
                }
                type="datetime-local"
                name="endDate"
                className="custom_inputt"
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
                className="custom_inputt"
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
                className="custom_inputt"
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
                className="custom_inputt"
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
                className="custom_inputt"
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
              <select
                name="currency"
                id=""
                required
                defaultValue={editData?.currency}
                className="custom_inputt"
                onChange={inputHandler}
              >
                <option value="">Select Currency</option>
                <option value="AED">AED</option>
                <option value="EURO">EURO</option>
                <option value="POUND">POUND</option>
                <option value="RUPEES">RUPEES</option>
                <option value="USD">USD</option>
              </select>
              {/* <input
              onChange={inputHandler}
              defaultValue={editData?.currency}
              type="text"
              name="currency"
              className="custom_inputt"
              required
            /> */}
            </div>
            {/* ------12. Event category----- */}

            <div className="w-1/2  gap-1 sm:gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-0 sm:mt-0  sm:mb-2 md:mb-3 lg:mb-4  xl:mb-6">
              <label htmlFor="" className="custom_input_label">
                Event Category
              </label>

              <div className="col-span-8 sm:col-span-4 ml- sm:ml-0 w-full">
                <select
                  name="category"
                  className="custom_inputt"
                  value={
                    eventDetail?.category?._id
                      ? 
                      eventDetail?.category._id:eventDetail?.category
                  }
                  onChange={inputHandler}
                  required
                  minLength={3}
                  maxLength={32}
                  selected
                >
                  {console.log(editData?.category?._id, "kk")}
                  <option value="">Select Category</option>
                  {/* {getallCategory.map((item) => (
                    <option
                      className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                      key={item._id}
                      value={item._id}
                      selected={
                        item._id === (editData?._id || eventDetail?.category)
                      }
                    >
                      {item?.title}
                    </option>
                  ))} */}
                  {getallCategory.map((item, index) => {
                    console.log(item);
                    return (
                      <>
                        <option
                          className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                          key={item._id}
                          value={item._id}
                          // selected={
                          //   item._id ===
                          //   (editData?.category?._id || eventDetail?.category)
                          // }
                        >
                          {item?.title}
                        </option>
                      </>
                    );
                  })}
                </select>
              </div>
            </div>
            {/* ------13. Event subCategory----- */}

            <div className="w-1/2  gap-1 sm:gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-0 sm:mt-0  sm:mb-2 md:mb-3 lg:mb-4  xl:mb-6">
              <label htmlFor="" className="custom_input_label">
                Event SubCategory
              </label>

              <div className="col-span-8 sm:col-span-4 ml- sm:ml-0 w-full">
                <select
                  name="subCategory"
                  className="custom_inputt w-full"
                   value={
                    eventDetail?.subCategory?._id
                      ? 
                      eventDetail?.subCategory._id:eventDetail?.subCategory
                  }
                  onChange={inputHandler}
                  required
                  minLength={3}
                  maxLength={32}
                >
                  <option value="">
                    Select Sub Category 
                  </option>
                  {getallSubCategory
                    .filter((item, indr) => {
                      // console.log(item, eventDetail);
                      return item?.category?._id === (eventDetail?.category?._id ? eventDetail?.category?._id: eventDetail?.category);
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
                className="custom_inputt"
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
                className="custom_inputt"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 w-full">
              {/*-------cover image------- */}
              <div className="ml-3 sm:ml-4 lg:ml-0  ">
                <span className="login-input-label 2xl:m-10 lg:m-5 text-[12px] sm:text-[16px] font-semibold">
                  Cover image
                </span>
                <div className="flex items-center gap-2  mb-3 2xl:m- lg:m-">
                  {Array.isArray(eventDetail?.images) &&
                    eventDetail.images.length > 0 && (
                      <>
                        {eventDetail.images.map((img, inx) => (
                          <div className="mt-4" key={inx}>
                            {(img.position === 0 && (
                              <img
                                src={img.url}
                                alt="loading.."
                                height={100}
                                width={100}
                                className="w-2/4 lg:ml-5 2xl:ml-9"
                              />
                            )) ||
                              (typeof img.position === "undefined" &&
                                inx === 0 && (
                                  <img
                                    src={img.url}
                                    alt="loading.."
                                    height={100}
                                    width={100}
                                    className="w-2/4"
                                  />
                                ))}
                          </div>
                        ))}
                      </>
                    )}
                </div>
              </div>

              {eventDetail?.images?.length > 0 && (
                <>
                  <div className="mb-4 2xl:px-10 lg:px-5 ml-3 sm:ml-4 md:ml-0  ">
                    <span className="login-input-label cursor-pointer text-[12px] sm:text-[16px] font-semibold">
                      Event Image
                    </span>
                    <div className="grid md:grid-cols-2 gap-2 4 ">
                      {eventDetail?.images?.map((item, inx) => (
                        <>
                          {/* {console.log(item)} */}
                          <div className="flex gap-2 items-center ">
                            <div className="flex gap-1 items-center ">
                              <p
                                className="underline md:text-[16px] text-[15px] font-[400] px-1 cursor-pointer text-[blue]"
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
                            {eventDetail?.images?.length > 1 && (
                              <div className="text-[14px]  flex items-center gap-2">
                                {/* {console.log(item)} */}
                                <label htmlFor={`cover${inx}`} className="">
                                  Cover{" "}
                                </label>
                                <input
                                  type="radio"
                                  name="cover"
                                  id={`cover${inx}`}
                                  onChange={() =>
                                    handleCoverImageChange(
                                      item?.position ? item?.position : inx
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </>
                      ))}
                    </div>
                    <div className="flex  gap-3 items-end mt-6">
                      <input
                        id="file"
                        type="file"
                        name="images"
                        disabled={imageDisable}
                        onChange={inputHandler}
                        className="w-full  border max-w-[200px] text-[12px] sm:text-[13px] md:text-[12px] lg:text-[14px]"
                        accept="image/png,image/jpg, image/jpeg , image/*"
                      />

                      <div className="flex items-center gap-2 ">
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
                            className={`focus-visible:outline-none  text-white text-[11px] sm:text-[13px] px-2 md:px-4 py-1 md:py-1 rounded 
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
                </>
              )}
            </div>

            {/* ------16. Event image----- */}

            {/* <div className="w-1/2"></div> */}
            <button type="submit" disabled={isLoading} className="custom_btn">
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
                      <img
                        //  src={`/utils?url=${encodeURIComponent(imgUrl)}`}
                        src={imgUrl}
                        alt="loading.."
                        // height={300}
                        // width={300}
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

export default EditEvent;
