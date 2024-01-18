"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import Link from "next/link";

import Pagination from "../../component/pagination";
import SingleEventPage from "../singleEvent/[slug]/page";
import { useRouter } from "next/navigation";
import UserProfile from "../../component/user/userProfile/page";
import { Dialog, Transition } from "@headlessui/react";
import Loader from "../../component/loader";
import { ToastContainer, toast } from "react-toastify";

const User = () => {
  const [ComponentId, setComponentId] = useState(1);
  const [getAllEvent, setGetAllEvent] = useState([]);

  const [getAllCate, setGetAllCate] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRefresh, setRefresh] = useState(false);
  const [allSubCategory, setAllCategory] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoader, setLoader] = useState(false);
  const [auth_token, setAuth_token] = useState("")
  // const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
  const [selectCategory, setSelectedCategory] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [issueText, setIssueText] = useState("");
  const [editCategory, setEditCategory] = useState({
    _id: "",
    category: "",
    subCategory: "",
  });
  const [limit, setLimit] = useState(12);
  const router = useRouter();
  const [openAddPopup, setAddPopup] = useState(false);

  const [eventId, setEventId] = useState("");
  const [userId, setUserId] = useState("");

  const menu = [
    {
      id: 1,
      label: "Dashboard",
      component: "",
      // icon: HomeIcon,
    },
    {
      id: 2,
      label: "Event",
      component: "",
      // icon: Users,
    },
    {
      id: 3,
      label: "Category",
      component: "",
      // icon: webIcon,
    },
    {
      id: 4,
      label: "Sub-Category",
      component: "",
      // icon: VideoIcon,
    },
    {
      id: 5,
      label: "User Profile",
      url: "/user/userProfile",
      // icon: Users,
    },
    {
      id: 6,
      label: "Setting",
      component: "",
      // icon: Users,
    },
  ];
  const closeAddPopup = () => {
    setAddPopup(false);
  };
  const closeAddPopupModel = () => {
    setAddPopup(false);
  };
  const handleOpenPopup = (eventId) => {
    setEventId(eventId);

    setAddPopup(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClick = (id) => {
    setComponentId(id);
  };
  const refreshData = () => {
    setRefresh(!isRefresh);
  };
  useEffect(() => {
    
    if (typeof window !== undefined && window.localStorage) {
      const token = localStorage.getItem("accessToken")
      // console.log(token);
      if (token) {
        setAuth_token(JSON.parse(token))
        console.log(token);
        verify(JSON.parse(token))
      }
    }
  }, [])
  

  //   ------get all events-------
  useEffect(() => {
    defaultEvent(current_page, limit);
  }, [current_page, isRefresh]);

  // const pageLimit = 12;
  const defaultEvent = (page, limit) => {
    setLoader(true);
    const option = {
      method: "GET",
      url: "/api/event/getAllEvents",
      params: {
        page: page,
        limit: limit,
        startDate,
        endDate,
        category: categoryFilter,
        subCategory: subCategoryFilter,
      },
    };
    axios
      .request(option)
      .then((response) => {
        console.log("chang",response?.data?.events)
        setGetAllEvent(response?.data?.events);
        setLoader(false);
        setTotalPages(response?.data?.total_pages || 1);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };
console.log(auth_token);
  //   -----------get All Category---------
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
        setGetAllCate(response?.data);
        console.log(response.data, "cate");
        setLoader(false);
        setTotalPages(response?.data?.total_pages || 1);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  //   ----------get all sub-category----------
  useEffect(() => {
    defaultCategory();
  }, [isRefresh]);

  const defaultCategory = () => {
    setLoader(true);

    // setLoadingBtn(true);
    const options = {
      method: "GET",
      url: "/api/subCategory/getallSubCategory",
      headers: {
        "content-type": "application/json",
        authorization: auth_token,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setAllCategory(response?.data);
        // setLoadingBtn(false);
        setLoader(false);
        setTotalPages(response?.data?.total_pages || 1);
      })
      .catch((error) => {
        console.error("Error:", error);
        // setLoadingBtn(false);
      });
  };

  // ------ filter by category ------ //
  const handleSearchCategories = (e) => {
    const cate = e.target.value;

    setCurrentPage(1);

    setSubCategoryFilter("");
    setCategoryFilter(e.target.value);
    const options = {
      method: "GET",
      url: `/api/event/getAllEvents?category=${
        e.target.value
      }&subCategory=${""}&startDate=${startDate}&endDate=${endDate}&page=${1}&limit=${limit}`,
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          setGetAllEvent(response?.data?.events);
          setTotalPages(response?.data?.total_pages || 1);
          // setSelectedCategory(subcate);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  console.log(subCategoryFilter);

  const inputHandler = (e) => {
    // const { name, value } = e.target;
    setEditCategory({ ...editCategory, [e.target.name]: e.target.value });
  };

  // ------ filter  by Sub-category ------ //

  const handleSearchSubCategory = (e) => {
    const subcate = e.target.value;
    setCurrentPage(1);

    setSubCategoryFilter(e.target.value);
    const options = {
      method: "GET",
      url: `/api/event/getAllEvents?category=${categoryFilter}&subCategory=${
        e.target.value
      }&startDate=${startDate}&endDate=${endDate}&page=${1}&limit=${limit}`,
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          setGetAllEvent(response?.data?.events);
          setTotalPages(response?.data?.total_pages || 1);
          // setSelectedCategory(subcate);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleDateSearch = (e) => {
    setCurrentPage(1);
    if (e.target.name === "startDate") {
      setStartDate(e.target.value.trim());
      const options = {
        method: "GET",
        url: `/api/event/getAllEvents`,
        params: {
          startDate: e.target.value.trim(),
          endDate,
          category: categoryFilter,
          subCategory: subCategoryFilter,
          page: 1,
          limit: limit,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          if (response.status === 200) {
            setGetAllEvent(response?.data?.events);
            setTotalPages(response?.data?.total_pages || 1);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    if (e.target.name === "endDate") {
      setEndDate(e.target.value.trim());

      const options = {
        method: "GET",
        url: `/api/event/getAllEvents`,
        params: {
          startDate,
          endDate: e.target.value.trim(),
          category: categoryFilter,
          subCategory: subCategoryFilter,
          page: 1,
          limit: limit,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          if (response.status === 200) {
            setGetAllEvent(response?.data?.events);
            setTotalPages(response?.data?.total_pages || 1);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  // ------verify user token-------
  // useEffect(() => {
  //   const auth_tokenA = JSON.parse(localStorage.getItem("accessToken"));

  //   if (auth_tokenA) {
  //     // verify();
  //   } else {
  //     setAuthenticated(false);
  //     // router.push("/user/login");
  //   }
  // }, []);

  const verify = async (tok) => {
    setLoader(true);
    try {
      const res = await axios.get(`/api/auth/verifyUserToken/${tok}`);
      if (res.status === 200) {
        const usersId = res?.data?.data?._id;
        setAuthenticated(true);
        setLoader(false);
        setUserId(usersId);

        console.log("user Id", res?.data?.data?._id);
        return;
      } else {
        setAuthenticated(false);
        router.push("/user/login");
        setLoader(false);
      }
    } catch (error) {
      setAuthenticated(false);
      console.error("Error occurred:", error);
      router.push("/user/login");
      setLoader(false);
    }
  };

  // ---------event isshue api----------

  const handleEventIssue = async (e) => {
    const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));

    setLoader(true);
    // const userId = await verify();

    try {
      // const userId = await verify();
      const response = await axios.post(
        "/api/issue/createEventIssue",
        {
          event: eventId,
          issue: issueText,
          userId: userId,
        },
        {
          headers: {
            authorization: auth_token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        toast.success("Submitted successfully !");
        refreshData();
        setIssueText("");
        // closeAddPopup();
        closeAddPopupModel();
        setLoader(false);
      } else {
        console.error("Failed to submit");
        toast.error("Failed to submit !");
      }
    } catch (error) {
      console.error("Error in submitting:", error.message);
      toast.error("Error in submition !");
    }
  };

  // ----------Log Out Api--------------
  const handleLogout = () => {
    // setLoader(true);
    // console.log("Logging out...");
    // localStorage.removeItem("accessToken");
    // router.push("/admin-login");
    // setLoader(false);
    try {
      setLoader(true);
      const options = {
        method: "GET",
        url: `/api/auth/logout`,
        headers: {
          "Content-Type": "application/json",
          authorization: auth_token,
        },
      };
      axios
        .request(options)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Logout!");
            setLoader(false);
            localStorage.removeItem("accessToken");
            router.push("/user/login");
            toast.success("Logout Successfully !");
          } else {
            setLoader(false);
            localStorage.removeItem("accessToken");
            router.push("/user/login");
            return;
          }
        })
        .catch((error) => {
          setLoader(false);
          console.error("Error:", error);
          // toast.error( "server error!");
          localStorage.removeItem("accessToken");
          router.push("/user/login");
        });
    } catch {
      console.log("error");
      toast.error("server error!");
      localStorage.removeItem("accessToken");
      router.push("/user/login");
    }
  };

  // ---------buy now  Event by id----------
  const handleEventById = async (id) => {
    try {
      const response = await axios.post(
        "/api/redirection/eventRedirection",
        {
          eventId: id,
        },
        {
          headers: {
            authorization: auth_token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        toast.success("Submitted successfully !");
      } else {
        console.error("Failed to submit");
      }
    } catch (error) {
      console.error("Error in submitting:", error.message);
    }
  };

  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer autoClose={3000} />
      <section className="bg-[#F3F3F3] ">
        <div className="pb-4">
          <nav className="bg-black p-3">
            <div>
              <ul className="flex flex-col sm:flex-row  items-center sm:items-start">
                {menu.map((item, index) => (
                  <li
                    key={item?.id}
                    className={`px-3 py-3 mx-2 sm:mx-2 lg:mx-2 xl:mx-4 2xl:mx-5 rounded-md flex gap-x-3 items-center cursor-pointer transition-colors font-semibold dash-menu hover:transition-all ease-in delay-100 duration-300  
                        ${
                          item.id === ComponentId
                            ? "bg-[#b8bbdf47]"
                            : "hover:bg-[#b8bbdf47] hover:text-white hover:rounded-md"
                        }`}
                    onClick={() => handleClick(item?.id)}
                  >
                    {/* {console.log(item)} */}
                    <Link href={item?.url ? item?.url : "#"}>
                      <div className="text-white">{item?.label}</div>
                    </Link>
                  </li>
                ))}
                <li>
                  <div
                    onClick={handleLogout}
                    className="px-3 py-3 mx-2 sm:mx-2 lg:mx-2 xl:mx-4 2xl:mx-5 rounded-md flex gap-x-3 items-center cursor-pointer transition-colors font-semibold dash-menu hover:transition-all ease-in delay-100 duration-300 text-white hover:bg-[#b8bbdf47]"
                  >
                    <p>Log Out</p>
                  </div>
                </li>
              </ul>
            </div>
          </nav>

          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 bg-white border border-gray-300 m-7 p-5 gap-3  rounded-md">
            {/* -----Filter Category-------- */}

            <div>
              <div className="flex flex-col items-center">
                <div>
                  {" "}
                  <label className=" text-gray-500 text-[14px] xl:text-[12px] 2xl:text-[16px]">
                    Filter by Category
                  </label>
                </div>

                <select
                  name="category"
                  className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                    2xl:text-sm  2xl:px-3 2xl:py-0 2xl:h-[37px] 2xl:w-36 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-28 
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-24 w-28
                     md:text-sm md:px-0 md:py-0 md:h-[25px] 
                     sm:text-sm  sm:px-2 sm:py-0 sm:h-[30px]
                      text-sm  px-2 pb-0 h-[24px] "
                  required
                  minLength={3}
                  maxLength={32}
                  onChange={(e) => {
                    handleSearchCategories(e);
                    inputHandler(e);
                  }}
                >
                  <option value=""> Category</option>
                  {getAllCate?.categories?.map((item) => (
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
              <div className="flex flex-col items-center">
                <div>
                  {" "}
                  <label className=" text-gray-500 text-[14px] xl:text-[12px] 2xl:text-[16px]">
                    Filter by SubCategory
                  </label>
                </div>
                <select
                  name="subCategory"
                  className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-0 2xl:h-[37px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-32
                   md:text-sm md:px-3 md:py- md:h-[25px] 
                   sm:text-sm  sm:px- sm:py- sm:h-[30px] 
                   text-sm  px-2 py- h-[24px] "
                  required
                  minLength={3}
                  maxLength={32}
                  onChange={(e) => {
                    handleSearchSubCategory(e);
                    inputHandler(e);
                  }}
                >
                  <option value=""> SubCategory</option>
                  {Array.isArray(allSubCategory) && allSubCategory
                    .filter((item, indr) => {
                      return item?.category?._id === editCategory?.category;
                    })
                    .map((itemss) => (
                      <option
                        className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                        key={itemss?._id}
                        value={itemss?._id}
                      >
                        {itemss?.subCategory}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* -----Filter Start Date-------- */}

            <div className="">
              <div className="flex flex-col items-center">
                <div>
                  {" "}
                  <label className=" text-gray-500 text-[14px] xl:text-[12px] 2xl:text-[16px]">
                    Filter by Start Date
                  </label>
                </div>
                <div>
                  <input
                    name="startDate"
                    type="date"
                    className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-32
                   md:text-sm md:px-3 md:py-2 md:h-[25px] 
                   sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px] 
                   text-sm  px-2 py-1 h-[24px] "
                    onChange={handleDateSearch}
                  />
                </div>
              </div>
            </div>

            {/* -----Filter End Date-------- */}

            <div className="">
              <div className="flex flex-col items-center">
                <div>
                  {" "}
                  <label className=" text-gray-500 text-[14px] xl:text-[12px] 2xl:text-[16px]">
                    Filter by End Date
                  </label>
                </div>
                <div>
                  <input
                    type="date"
                    name="endDate"
                    className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[11px]  lg:px-2 lg:py-1  lg:w-32
                   md:text-sm md:px-3 md:py-2 md:h-[25px] 
                   sm:text-sm  sm:px-2 sm:py-1 sm:h-[30px] 
                   text-sm  px-2 py-1 h-[24px] "
                    onChange={handleDateSearch}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="p-7 sm:w-full w-[321px]  xl:w-[1250px] 2xl:w-[1546px]">
              <div>
                {getAllEvent?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {getAllEvent?.map((item, index) => (
                      <div
                        key={index}
                        className="card border hover:border-1 border-gray-300 hover:border-gray-700 rounded-md p-2 bg-white flex flex-col"
                      >
                        {/* {console.log(item?.resource_url)} */}
                        <Link
                          target="_blank"
                          href={`/singleEvent/${item?._id}`}
                        >
                          <img
                            src={item?.images[0]?.url}
                            alt="image"
                            className="w-full h-48 object-scale-down rounded-md cursor-pointer"
                            // onClick={()=>singleEvent(item?._id)}
                          />
                        </Link>
                        <div className="container p-4 flex-grow">
                          <h4 className="text-[16px] font-bold mb-2 truncate">
                            {item?.name}
                          </h4>
                          <div className="flex text-[14px] mt-2">
                            <p className="mr-[4px] sm:mr-2">Category :</p>
                            {item?.category ? (
                              <p className="mb-2">{item?.category?.title}</p>
                            ) : (
                              <p>Category not allotted</p>
                            )}
                          </div>
                          <div className="flex text-[14px]">
                            <p className="w-1/3 mr-">Location :</p>
                            <p className="mb-2 w-2/3 truncate ">
                              {item?.location}
                            </p>
                          </div>
                          <div className="flex text-[14px]">
                            <p className="sm:mr-[44px] mr-[38px]">City :</p>
                            <p className="mb-2">{item?.city}</p>
                          </div>
                          <div className="flex text-[14px]">
                            <p className="mr-[32px] sm:mr-9">Price :</p>
                            {item?.price ? (
                              <p className="mb-2">{item?.price}</p>
                            ) : (
                              <p className="mb-2">Price not available</p>
                            )}
                          </div>
                          <div className="flex text-[14px] justify-center">
                            {item?.resource_url ? (
                              <Link
                                href={item?.resource_url}
                                target="_blank"
                                className="px-8  py-2 border border-gray-200 bg-gray-200 rounded-md hover:bg-gray-400 hover:text-white"
                                onClick={() => handleEventById(item?._id)}
                              >
                                Buy Now
                              </Link>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end items-end p-4">
                          <button
                            onClick={() => handleOpenPopup(item?._id)}
                            className="px-4 py-2 border text-[12px] border-gray-200 rounded-md hover:bg-gray-300 hover:text-white"
                          >
                            Report Issue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* -----pagination------ */}
          {total_pages > 1 && (
            <Pagination
              total_pages={total_pages}
              current_page={current_page}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>

      {/* ---------dialog panel------------- */}
      <Transition appear show={openAddPopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeAddPopup}>
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
                <Dialog.Panel className=" w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white px-5  sm:pl- py-4 text-left align-middle shadow-2xl transition-all">
                  <div className="flex justify-end items-end ">
                    <button
                      className=" cursor-pointer"
                      onClick={closeAddPopupModel}
                    >
                      <img
                        className="w-4 sm:w-7"
                        src="/images/close-square.svg"
                        alt="close-img"
                      />
                    </button>
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="mb-4 flex justify-center lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    Report Issue
                  </Dialog.Title>
                  <textarea
                    value={issueText}
                    onChange={(e) => setIssueText(e.target.value)}
                    placeholder="Enter text here..."
                    className="border border-gray-200 w-full "
                    rows="4"
                    cols="40"
                    name="comment"
                    form="usrform"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      onClick={handleEventIssue}
                      className="px-2 py-1  text-[14px] sm:text-[16px] rounded-md  hover:text-white bg-blue-300 hover:bg-blue-500"
                    >
                      Submit
                    </button>
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

export default User;
