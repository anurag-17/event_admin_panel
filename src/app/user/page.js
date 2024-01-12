"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import Pagination from "../../component/pagination";
import SingleEventPage from "../singleEvent/[slug]/page";

const User = () => {
  const [ComponentId, setComponentId] = useState(1);
  const [getAllEvent, setGetAllEvent] = useState([]);
  const [getSingleEvent,setGetSingleEvent]=useState([]);
  const [getAllCate, setGetAllCate] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRefresh, setRefresh] = useState(false);
  const [allSubCategory, setAllCategory] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [isLoader, setLoader] = useState(false);
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
  const [selectCategory, setSelectedCategory] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editCategory, setEditCategory] = useState({
    _id: "",
    category: "",
    subCategory: "",
  });
  const [limit, setLimit] = useState(12);

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
      label: "All Users",
      component: "",
      // icon: Users,
    },
    {
      id: 6,
      label: "Setting",
      component: "",
      // icon: Users,
    },
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClick = (id) => {
    setComponentId(id);
    // setShowDrawer(false);
  };
  const refreshData = () => {
    setRefresh(!isRefresh);
  };

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
       
        setGetAllEvent(response.data.events);
        setLoader(false);
        setTotalPages(response?.data?.total_pages || 1);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

// ----------get event by id----------
// useEffect(() => {
//   singleEvent();
// }, [isRefresh]);

// const singleEvent = (id) => {
//   console.log("aaa",id)
//   setLoader(true);
//   const option = {
//     method: "POST",
//     url: "/api/event/getEvent", data: { id: id },

//   };
//   axios
//     .request(option)
//     .then((response) => {
//       console.log("abc",response.data);
//       setGetSingleEvent(response.data);
//       // setGetAllCate(response.data);
//       setLoader(false);
    
//     })
//     .catch((err) => {
//       console.log(err, "Error");
//     });
// };




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
        setGetAllCate(response.data);
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
          setGetAllEvent(response.data.events);
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
          setGetAllEvent(response.data.events);
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
            setGetAllEvent(response.data.events);
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
            setGetAllEvent(response.data.events);
            setTotalPages(response?.data?.total_pages || 1);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  return (
    <>
      <section className="bg-[#F3F3F3] ">
        <div className="pb-4">
          <nav className="bg-black p-3">
            <div>
              <ul className="flex flex-col sm:flex-row  items-center sm:items-start">
                {menu.map((item, index) => (
                  <li
                    key={item.id}
                    className={`px-3 py-3 mx-2 sm:mx-2 lg:mx-2 xl:mx-4 2xl:mx-5 rounded-md flex gap-x-3 items-center cursor-pointer transition-colors font-semibold dash-menu hover:transition-all ease-in delay-100 duration-300  
                        ${
                          item.id === ComponentId
                            ? "bg-[#b8bbdf47]"
                            : "hover:bg-[#b8bbdf47] hover:text-white hover:rounded-md"
                        }`}
                    onClick={() => handleClick(item.id)}
                  >
                    <Link href={item.component}>
                      <div className="text-white">{item.label}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 bg-white border border-gray-300 m-7 p-5 gap-3  rounded-md">
            {/* -----Filter Category-------- */}

            <div>
              <div className="">
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
              <div className="">
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
            <div className="p-7 sm:w-full w-[321px]  2xl:w-[80%]">
              <div>
                {getAllEvent?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getAllEvent.map((item, index) => (
                      <div
                        key={index}
                        className="card border hover:border-1 border-gray-300 hover:border-gray-700 rounded-md p-2 bg-white "
                      >
                      {/* {console.log(item)} */}
                    <Link href={`/singleEvent/${item?._id}`}>
                        <img
                          src={item?.images[0]?.url}
                          alt="image"
                          className="w-full h-48 object-fill rounded-md cursor-pointer"
                          // onClick={()=>singleEvent(item?._id)}
                        /></Link>
                        <div className="container p-4">
                          <h4 className="text-[16px] font-bold mb-2 truncate">
                            {item?.name}
                          </h4>
                          <div className="flex text-[14px] my-2">
                            <p>Category :</p>
                            {item?.category ? (
                              <p className="mb-2">{item?.category?.title}</p>
                            ) : (
                              <p>Category not alloted</p>
                            )}
                          </div>
                          <div className="flex text-[14px]">
                            <p>Location :</p>
                            <p className="mb-2 truncate">{item?.location}</p>
                          </div>
                          <div className="flex text-[14px]">
                            <p>City :</p>
                            <p className="mb-2">{item?.city}</p>
                          </div>
                          <div className="flex text-[14px]">
                            <p>Price :</p>
                            {item?.price ? (
                              <p className="mb-2">{item.price}</p>
                            ) : (
                              <p className="mb-2">Price not available</p>
                            )}
                          </div>
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
          <SingleEventPage
            getSingleEvent={getSingleEvent}
          />
        </div>
      </section>
    </>
  );
};

export default User;
