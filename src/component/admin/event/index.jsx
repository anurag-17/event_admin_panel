import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import CreateEvent from "./create-module";
import EditEvent from "./update-module";
import DeleteEvent from "./delete-module";
import Loader from "../../loader";
import cut from "../../../../public/images/close-square.svg";
import Pagination from "../../pagination";
import { ToastContainer } from "react-toastify";

const Event = () => {
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
  const [getAllEvent, setGetAllEvent] = useState([]);
  const [isRefresh, setRefresh] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [eventID, setEventId] = useState("");
  const [editEvent, setEventEdit] = useState("");
  const [editData, setEditData] = useState([]);
  const [isLoader, setLoader] = useState(false);
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [getAllCate, setGetAllCate] = useState([]);
  const [eventDetail, setEventDetail] = useState(editData);
  const [editCategory, setEditCategory] = useState({
    _id: "",
    category: "",
    subCategory: "",
  });
  const [selectCategory, setSelectedCategory] = useState(null);
  const [eventCategory, setEventCategory] = useState(["All"]);
  const [eventSubCategory, setEventSubCategory] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState("");
  const [eventFetch, setEventFetch] = useState("");
  const visiblePageCount = 10;

  const handleImageClick = (imageSrc) => {
    setLargeImageSrc(imageSrc);
    setShowLargeImage(true);
  };
  const handleLargeImageClose = () => {
    setShowLargeImage(false);
  };
  const openDrawerO = async (_id) => {
    try {
      const options = {
        method: "POST",
        url: "/api/event/getEvent",
        data: {
          id: _id,
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setEditData(response.data);
        console.log(response.data, "A Event");

        setIsDrawerOpenO(true);
      } else {
        console.error("Error: Unexpected response status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeDrawerO = () => {
    setIsDrawerOpenO(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  function closeModal() {
    setOpenDelete(false);
  }

  function openModal(id) {
    setEventId(id);
    setOpenDelete(true);
  }
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  useEffect(() => {
    defaultEvent(current_page, pageLimit);
  }, [current_page, isRefresh]);

  const pageLimit = 20;
  const defaultEvent = (page, limit) => {
    setLoader(true);
    const option = {
      method: "GET",
      url: "/api/event/getAllEvents",
      params: {
        page: page,
        limit: limit,
      },
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllEvent(response.data.events);
        setLoader(false);
        setTotalPages(response?.data?.total_pages || 1);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  const handleSearch = (e) => {
    const search = e.target.value;
    if (search.trim() === "") {
      refreshData();
    } else {
      const options = {
        method: "GET",
        url: `/api/event/getAllEvents?searchQuery=${search}`,
      };
      axios
        .request(options)
        .then(function (response) {
          if (response.status === 200) {
            setGetAllEvent(response.data.events);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  const handleDateSearch = (e) => {
    const startDate = e.target.value.trim();

    if (startDate === "") {
      refreshData();
    } else {
      const endDate = "";
      const options = {
        method: "GET",
        url: `http://localhost:4000/api/event/getAllEvents`,
        params: {
          startDate,
          endDate,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          if (response.status === 200) {
            setGetAllEvent(response.data.events);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    defaultgetAllCate();
  }, [isRefresh]);

  const defaultgetAllCate = () => {
    setLoader(true);
    const option = {
      method: "GET",
      url: "/api/category/getallCategory",
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllCate(response.data);
        console.log(response.data, "cate");
        setLoader(false);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  useEffect(() => {
    defaultsubCategory();
  }, [isRefresh]);

  const defaultsubCategory = () => {
    setLoader(true);

    const options = {
      method: "GET",
      url: "/api/subCategory/getallSubCategory",
      headers: {
        "content-type": "application/json",
      },
    };

    axios
      .request(options)
      .then((response) => {
        setAllSubCategory(response?.data);
        console.log(response?.data, "subb");
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const inputHandler = (e) => {
    // const { name, value } = e.target;
    setEditCategory({ ...editCategory, [e.target.name]: e.target.value });
  };

  const handleUpdateCategory = async (id) => {
    editCategory._id = id;
    try {
      const response = await axios.put(`/api/event/updateEvent`, editCategory, {
        headers: {
          "Content-Type": "application/json",
          authorization: auth_token,
        },
      });

      if (response.status === 200) {
        closeDrawer();
        refreshData();
        setEditCategory({
          _id: "",
          category: "",
          subCategory: "",
        });
      } else {
        console.error("Server error!");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };
  // ------ filter by category ------ //
  const handleSearchCategories = (e) => {
    const cate = e.target.value;
    if (cate === "All") {
      setCategoryFilter("");
      refreshData();
      setSelectedCategory(cate);
    } else {
      setCategoryFilter(e.target.value);
      const options = {
        method: "GET",
        url:
          subCategoryFilter == ""
            ? `http://localhost:4000/api/event/getAllEvents?category=${cate}`
            : `http://localhost:4000/api/event/getAllEvents?category=${cate}&subCategory=${subCategoryFilter}`,
      };
      axios
        .request(options)
        .then(function (response) {
          if (response.status === 200) {
            setAllProduct(response?.data?.events);
            setSelectedCategory(subcate);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };
  // ------ filter  by Sub-category ------ //

  const handleSearchSubCategory = (e) => {
    const subcate = e.target.value;

    if (subcate === "All") {
      setSubCategoryFilter("");
      refreshData();
    } else {
      setSubCategoryFilter(subcate);
      const options = {
        method: "GET",
        url:
          categoryFilter == ""
            ? `http://localhost:4000/api/event/getAllEvents?subCategory=${subcate}`
            : `http://localhost:4000/api/event/getAllEvents?subCategory=${subcate}&category=${categoryFilter}`,
      };
      axios
        .request(options)
        .then(function (response) {
          if (response.status === 200) {
            setGetAllEvent(response?.data?.events);
            console.log(response?.data?.events, "jj");
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  // -----------------event fetch--------------

  const defaultEventFetch = () => {
    const options1 = {
      method: "GET",
      url: "http://localhost:4000/api/auth/fetchEvents",
    };

    const options2 = {
      method: "GET",
      url: "http://localhost:4000/api/event/skiddleEvents",
    };

    const options3 = {
      method: "GET",
      url: "http://localhost:4000/api/event/londontheatredirect",
    };

    axios
      .all([
        axios.request(options1),
        axios.request(options2),
        axios.request(options3),
      ])
      .then(
        axios.spread((response1, response2, response3) => {
          if (response1.status === 200) {
            setEventFetch(response1.data);
            console.log(response1.data, "fetchEvents");
          }

          if (response2.status === 200) {
            setEventFetch(response2.data);
            console.log(response2.data, "skiddleEvents");
          }

          if (response3.status === 200) {
            setEventFetch(response3.data);
            console.log(response3.data, "londontheatredirect");
          }
        })
      )
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer />
      <div>
        <div className="sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:px-10 border mx-10 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold">Event List </h2>

          <div className="flex items-center w-[40%]">
            <input
              type="search"
              className=" border border-gray-500 p-[2px] lg:p-[4px] 2xl:p-3 rounded-lg  w-11/12 focus:outline-none text-black"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
              onChange={handleSearch}
            />
          </div>
          <h2>Welcome Back, Admin</h2>
        </div>

        {/* ---------Event fetch---------- */}
        <div className=" flex justify-between  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border mx-10 lg:mx-8   rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] lg:mt-5 sm:mt-3 mt-2 h-[45px]">
          <div className="flex gap-2">
            <div className="">
              <div className="">
                <div>
                  {" "}
                  <label className=" text-gray-500 lg:text-[11px] xl:text-[12px] 2xl:text-[16px]">
                    Start Date
                  </label>
                </div>
                <div>
                  <input
                    type="date"
                    value=""
                    className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-32
                   md:text-sm md:px-3 md:py-2 md:h-[25px] 
                   sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px] 
                   text-sm  px-2 py-1 h-[20px] "
                  />
                </div>
              </div>
            </div>
            <div className="">
              <div className="">
                <div>
                  {" "}
                  <label className=" text-gray-500 lg:text-[11px] xl:text-[12px] 2xl:text-[16px]">
                    End Date
                  </label>
                </div>
                <div>
                  <input
                    type="date"
                    className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-32
                   md:text-sm md:px-3 md:py-2 md:h-[25px] 
                   sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px] 
                   text-sm  px-2 py-1 h-[20px] "
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <button
              onClick={defaultEventFetch}
              className="border hover:bg-gray-300 rounded-md my-auto bg-lightBlue-600  cursor-pointer 2xl:p-3  2xl:text-[22px] xl:p-2 xl:text-[14px] lg:p-[6px] lg:text-[12px] md:text-[10px] md:p-1 sm:text-[10px] sm:p-1 p-[3px] text-[10px]"
            >
              + Fetch External Event
            </button>
          </div>
        </div>
        <div className=" flex justify-between  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border mx-10 lg:mx-8    rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] lg:mt-5 sm:mt-3 mt-2 h-[45px]">
          <div>
            <div className="flex gap-2 lg:gap-2 xl:gap-2 2xl:gap-4">
              {/* -----Filter Category-------- */}

              <div>
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 lg:text-[11px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by Category
                    </label>
                  </div>

                  <select
                    name="category"
                    className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                    2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-36 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-28 
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-24
                     md:text-sm md:px-3 md:py-2 md:h-[25px] 
                     sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px]
                      text-sm  px-2 py-1 h-[20px] "
                    required
                    minLength={3}
                    maxLength={32}
                    onChange={(e) => {
                      handleSearchCategories(e);
                      inputHandler(e);
                    }}
                  >
                    <option value=""> Category</option>
                    {getAllCate.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                        className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                      >
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* -----Filter SubCategory-------- */}

              <div className="">
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 lg:text-[11px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by SubCategory
                    </label>
                  </div>
                  <select
                    name="subCategory"
                    className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-32
                   md:text-sm md:px-3 md:py-2 md:h-[25px] 
                   sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px] 
                   text-sm  px-2 py-1 h-[20px] "
                    required
                    minLength={3}
                    maxLength={32}
                    onChange={(e) => {
                      handleSearchSubCategory(e);
                      inputHandler(e);
                    }}
                  >
                    <option value=""> SubCategory</option>
                    {allSubCategory
                      .filter((item, indr) => {
                        return item?.category?._id === editCategory?.category;
                      })
                      .map((itemss) => (
                        <option
                          className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                          key={itemss?._id}
                          value={itemss._id}
                        >
                          {itemss?.subCategory}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* -----Filter Start Date-------- */}

              <div className="">
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 lg:text-[11px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by Start Date
                    </label>
                  </div>
                  <div>
                    <input
                      type="date"
                      className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-32
                   md:text-sm md:px-3 md:py-2 md:h-[25px] 
                   sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px] 
                   text-sm  px-2 py-1 h-[20px] "
                      onChange={handleDateSearch}
                    />
                  </div>
                </div>
              </div>
              {/* -----Filter End Date-------- */}

              <div className="">
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 lg:text-[11px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by End Date
                    </label>
                  </div>
                  <div>
                    <input
                      type="date"
                      className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-32
                   md:text-sm md:px-3 md:py-2 md:h-[25px] 
                   sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px] 
                   text-sm  px-2 py-1 h-[20px] "
                      onChange={handleDateSearch}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -----Add Event-------- */}

          <div className="">
            <button
              onClick={openDrawer}
              className="border hover:bg-gray-300 rounded-md my-auto bg-lightBlue-600  cursor-pointer 2xl:p-3  2xl:text-[22px] xl:p-2 xl:text-[14px] lg:p-[6px] lg:text-[12px] md:text-[10px] md:p-1 sm:text-[10px] sm:p-1 p-[3px] text-[10px]"
            >
              + Add Event
            </button>
          </div>
        </div>
        {isDrawerOpen && (
          <div
            id="drawer-form"
            className="fixed content-center mb-5 z-40 h-[70%] lg:h-[80%] lg:w-8/12 w-10/12  p-4 overflow-y-auto  transition-transform -translate-x-0 bg-white border rounded-lg 2xl:top-32 xl:top-[85px] lg:top-[70px] right-8"
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawer}
              className=" text-gray-400  shadow-2xl text-sm   top-2  inline-flex items-center justify-center "
            >
              <Image src={cut} className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14" />
              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <CreateEvent
                closeDrawer={closeDrawer}
                refreshData={refreshData}
              />
            </div>
          </div>
        )}
        {isDrawerOpenO && (
          <div
            id="drawer-form"
            className="border fixed content-center mb-5  z-40 h-[70%] lg:h-[80%] lg:w-8/12 w-10/12  p-4 overflow-y-auto transition-transform -translate-x-0 bg-white 2xl:top-32 xl:top-[85px] lg:top-[70px] right-8 "
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawerO}
              className="  shadow-2xl text-sm   top-1  inline-flex items-center justify-center "
            >
              <Image src={cut} className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14" />

              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <EditEvent
                editEvent={editEvent}
                closeDrawer={closeDrawerO}
                refreshData={refreshData}
                editData={editData}
              />
            </div>
          </div>
        )}
        <div className="relative flex mx-10 lg:mx-8  overflow-x-auto ">
          <div className=" z-10 w-full ">
            <table className="lg:w-[130%]  border bg-white rounded-md mt-5 p-10">
              <thead className="">
                <tr
                  className="w-full bg-coolGray-200 text-gray-400 text-start flex  px-2 border
          2xl:text-[22px] 
          xl:text-[14px]
           lg:text-[12px] 
           md:text-[12px] 
           sm:text-[12px] 
           text-[10px] "
                >
                  <th className=" w-1/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 ">
                    S.NO
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                    Image
                  </th>
                  <th className="  w-4/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5  ">
                    EVENT NAME
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                    City
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                    Start Date
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                    End Date
                  </th>

                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                    Location
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                    Category
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                    Action
                  </th>
                </tr>
              </thead>
              <div className="overflow-y-scroll  ">
                <div className="h-[300px] xl:h-[400px] 2xl:h-[500px]">
                  {getAllEvent?.length > 0 && (
                    <tbody className="px-2 w-full">
                      <div className="w-full">
                        {getAllEvent.map((item, index) => (
                          <tr
                            key={index}
                            className="  p-2 text-start flex 2xl:text-[22px] xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[13px] text-[10px]"
                          >
                            <td className=" my-auto w-1/12">
                              {index + 1 + "."}
                            </td>
                            <td className="my-auto  w-2/12  text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] ">
                              <div
                                className="cursor-pointer "
                                onClick={() => handleImageClick(item?.image)}
                              >
                                <img
                                  src={item?.images[0]?.url}
                                  height={100}
                                  width={100}
                                  className="w-2/4"
                                />
                              </div>
                              <div className="">
                                {showLargeImage && (
                                  <div className="fixed border-2 top-40 left-96 w-6/12 lg:h-[350px] xl:h-[450px] flex items-center justify-center bg-white bg-opacity-75">
                                    <div className="max-w-3xl w-full">
                                      <div
                                        className="flex justify-end cursor-pointer"
                                        onClick={handleLargeImageClose}
                                      >
                                        <Image
                                          src={cut}
                                          className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14 "
                                        />
                                      </div>
                                      <div
                                        className="cursor-pointer"
                                        onClick={() => setShowLargeImage(false)}
                                      >
                                        <img
                                          src={item?.images[0]?.url}
                                          height={240}
                                          width={240}
                                          className="mx-auto xl:w-[400px]"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="my-auto  w-4/12  text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-[22px]">
                              <p className="w-40">{item.name}</p>
                            </td>

                            <td className="my-auto  w-2/12  text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-10">
                              {item.city}
                            </td>
                            <td className="my-auto  w-3/12  text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-7">
                              {item.startDate}
                            </td>
                            <td className="my-auto  w-3/12 text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-7">
                              {item.endDate}
                            </td>
                            <td className="my-auto  w-3/12 text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-8">
                              {item.location}
                            </td>
                            <td className="my-auto  w-3/12 text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px]  xl:pl-7 ">
                              <div className="">
                                <select
                                  name="category"
                                  className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                    2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-36 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-28 
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-24
                     md:text-sm md:px-3 md:py-2 md:h-[25px] 
                     sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px]
                      text-sm  px-2 py-1 h-[20px] "
                                  onChange={inputHandler}
                                  required
                                  minLength={3}
                                  maxLength={32}
                                  defaultValue={item?.category?._id}
                                >
                                  <option value="">Select Category</option>

                                  {getAllCate.map((items) => (
                                    <option
                                      className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                                      key={items._id}
                                      value={items._id}
                                    >
                                      {items.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="my-1">
                                <select
                                  name="subCategory"
                                  className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                                   2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-36 
                                   xl:text-[12px]  xl:px-3 xl:py-0  xl:w-28 
                                   lg:text-[11px]  lg:px-2 lg:py-1  lg:w-24
                                    md:text-sm md:px-3 md:py-2 md:h-[25px] 
                                    sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px]
                      text-sm  px-2 py-1 h-[20px] "
                                  onChange={inputHandler}
                                  required
                                  minLength={3}
                                  maxLength={32}
                                  defaultValue={item?.subCategory?._id}
                                >
                                  <option value="">Select Sub Category</option>
                                  {allSubCategory
                                    .filter((item, indr) => {
                                      return (
                                        item?.category?._id ===
                                        editCategory?.category
                                      );
                                    })
                                    .map((itemss) => (
                                      <option
                                        className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                                        key={itemss?._id}
                                        value={itemss._id}
                                      >
                                        {itemss?.subCategory}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <button
                                onClick={() => handleUpdateCategory(item?._id)}
                                className="border bg-blue-500 hover:bg-blue-600 text-white py-[2px] px-1 rounded-md lg:rounded-lg ml-1 lg:ml-2"
                              >
                                Save
                              </button>
                            </td>

                            <td className="my-auto  w-2/12 xl:pl-12 ">
                              <div className="flex my-3 gap-3 ">
                                <button onClick={() => openDrawerO(item?._id)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-sky-600"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => openModal(item?._id)}
                                  type="button"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-red-800"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </div>
                      <hr />
                    </tbody>
                  )}
                </div>
              </div>
            </table>
          </div>
        </div>
      </div>

      <Pagination
        total_pages={total_pages}
        current_page={current_page}
        onPageChange={handlePageChange}
      />

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    Are You Sure! Want to Delete?
                  </Dialog.Title>
                  <DeleteEvent
                    eventID={eventID}
                    closeModal={closeModal}
                    refreshData={refreshData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Event;
