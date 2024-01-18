import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CreateEvent from "./create-module";
import EditEvent from "./update-module";
import DeleteEvent from "./delete-module";
import Loader from "../../loader";
import cut from "../../../../public/images/close-square.svg";
import Pagination from "../../pagination";
import ImageModal from "./ImageModal";
import moment from "moment";
import Topbar from "../../../app/admin/admin-dashboard/topbar";
import { useAuth } from "../../../contexts/AuthContext";

const Event = () => {
  const { adminAuthToken } = useAuth();

  // const [auth_token, setAuth_token] = useState(
  //   typeof window !== "undefined"
  //     ? JSON.parse(localStorage.getItem("accessToken") || "")
  //     : null
  // );

  // const auth_token = JSON.parse(localStorage.getItem("accessToken") || "");
  const [getAllEvent, setGetAllEvent] = useState([]);
  const [isRefresh, setRefresh] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isOpenAddEvent, setOpenAddEvent] = useState(false);
  const [isOpenEditEvent, setOpenEditEvent] = useState(false);
  const [eventID, setEventId] = useState("");
  const [editEvent, setEventEdit] = useState("");
  const [editData, setEditData] = useState([]);
  const [isLoader, setLoader] = useState(false);
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [getAllCate, setGetAllCate] = useState([]);
  const [editCategory, setEditCategory] = useState({
    _id: "",
    category: "",
    subCategory: "",
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState([]);
  const [eventFetch, setEventFetch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState(20);
  const [isLoading, setLoading] = useState(false);
  const [citiesList, setCitiesList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("");
  const [filteredSubCategory, setFilteredSubCategory] = useState("");
  const [fetchStartDate, setFetchStartDate] = useState("");
  const [fetchEndDate, setFetchEndDate] = useState("");
  //----------Date/Time Formate
  const convertTime = (time) => {
    const parsedDateTime = moment(time);
    const formattedDateTime = parsedDateTime.format("DD/MM/YYYY HH:mm");
    return formattedDateTime;
  };

  const handleImageClick = (images) => {
    setLargeImageSrc(images);
    setShowLargeImage(true);
  };
  const handleLargeImageClose = () => {
    setShowLargeImage(false);
  };
  const openDrawerO = async (_id) => {
    setLoader(true);
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
        setEditData(response?.data);
        // console.log(response?.data, "A Event");

        setIsDrawerOpenO(true);
        setLoader(false);
      } else {
        console.error("Error: Unexpected response status");
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
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
    setOpenAddEvent(false);
    setOpenEditEvent(false);
  }

  function openAddModal(id) {
    setEventId(id);
    setOpenAddEvent(true);
  }

  function openEditModal(id) {
    setEventId(id);
    setOpenEditEvent(true);
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
    defaultEvent(current_page, limit);
  }, [current_page, isRefresh]);

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
        setGetAllEvent(response?.data?.events);
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

  useEffect(() => {
    defaultgetAllCate();
    defaultsubCategory();
    getAllCities(1, 10000);
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
        setGetAllCate(response?.data?.categories);
        // console.log(response.data.categories, "cate");
        setLoader(false);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

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
        setAllSubCategory(response?.data?.subCategories);
        console.log(response?.data.subCategories, "subb");
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const inputHandler = (e) => {
    setEditCategory((prevEditCategory) => ({
      ...prevEditCategory,
      [e.target.name]: e.target.value,
    }));
    // editCategory[e.target.name] = e.target.value
    console.log(editCategory);
  };

  const handleUpdateCategory = async (id) => {
    if (editCategory?.category === "" || editCategory?.subCategory === "") {
      toast.warn("Please select category and subcategory both");
    } else {
      editCategory._id = id;
      try {
        setLoader(true);
        const response = await axios.put(
          `/api/event/updateEvent`,
          editCategory,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: useAuth,
            },
          }
        );

        if (response.status === 200) {
          closeDrawer();
          refreshData();
          setEditCategory({
            _id: "",
            category: "",
            subCategory: "",
          });
          toast.success("submit successfully!");
          setLoader(false);
        } else {
          console.error("Server error!");
          setLoader(false);
        }
      } catch (error) {
        console.error("Server error:", error);
        toast.error(error?.response?.data?.message || "server error");
        setLoader(false);
      }
    }
  };
  // ------ filter by category ------ //
  const handleSearchCategories = (e) => {
    setFilteredCategory(e.target.value);
    setLoader(true);
    try {
      const cate = e.target.value;
      setCurrentPage(1);

      setSubCategoryFilter("");
      setCategoryFilter(e.target.value);
      const options = {
        method: "GET",
        url: `/api/event/getAllEvents?category=${
          e.target.value
        }&subCategory=${""}&startDate=${startDate}&endDate=${endDate}&provider=${providerFilter}&page=${1}&limit=${limit}`,
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status === 200) {
            setGetAllEvent(response?.data?.events);
            setTotalPages(response?.data?.total_pages || 1);
            setLoader(false);
          } else {
            setLoader(false);
            return;
          }
        })
        .catch(function (error) {
          console.error(error);
          setLoader(false);
        });
    } catch {
      console.error(error);
      setLoader(false);
    }
  };
  // ------ filter  by Sub-category ------ //

  const handleSearchSubCategory = (e) => {
    const subcate = e.target.value;
    setLoader(true);
    setCurrentPage(1);
    setSubCategoryFilter(e.target.value);
    const options = {
      method: "GET",
      url: `/api/event/getAllEvents?category=${categoryFilter}&subCategory=${
        e.target.value
      }&startDate=${startDate}&endDate=${endDate}&provider=${providerFilter}&page=${1}&limit=${limit}`,
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          setGetAllEvent(response?.data?.events);
          setTotalPages(response?.data?.total_pages || 1);
          setLoader(false);
        }
      })
      .catch(function (error) {
        console.error(error);
        setLoader(false);
      });
  };

  // ------ filter by Date ------ //

  const handleDateSearch = (e) => {
    setLoader(true);
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
          city: cityFilter,
          provider: providerFilter,
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
          setLoader(false);
        })
        .catch(function (error) {
          console.error(error);
          setLoader(false);
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
          city: cityFilter,
          provider: providerFilter,
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
          setLoader(false);
        })
        .catch(function (error) {
          console.error(error);
          setLoader(false);
        });
    }
  };
  // ------ filter by city ------ //
  const handleSearchCity = (e) => {
    setLoader(true);
    setCurrentPage(1);
    setCityFilter(e.target.value);
    try {
      const options = {
        method: "GET",
        url: `/api/event/getAllEvents?category=${categoryFilter}&subCategory=${""}&startDate=${startDate}&endDate=${endDate}&city=${
          e.target.value
        }&provider=${providerFilter}&page=${1}&limit=${limit}`,
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status === 200) {
            setGetAllEvent(response?.data?.events);
            setTotalPages(response?.data?.total_pages || 1);
            setLoader(false);
          } else {
            setLoader(false);
            return;
          }
        })
        .catch(function (error) {
          console.error(error);
          setLoader(false);
        });
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  // ------ filter by Provider ------ //
  const handleSearchProvider = (e) => {
    setCurrentPage(1);
    setProviderFilter(e.target.value);
    setLoader(true);
    try {
      const options = {
        method: "GET",
        url: `/api/event/getAllEvents?category=${categoryFilter}&subCategory=${""}&startDate=${startDate}&endDate=${endDate}&city=${cityFilter}&provider=${
          e.target.value
        }&page=${1}&limit=${limit}`,
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status === 200) {
            setGetAllEvent(response.data.events);
            setTotalPages(response?.data?.total_pages || 1);
            setLoader(false);
          } else {
            setLoader(false);
            return;
          }
        })
        .catch(function (error) {
          console.error(error);
          setLoader(false);
        });
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  // -----------------event fetch--------------

  const defaultEventFetch = () => {
    setLoader(true);
    const options1 = {
      method: "GET",
      url: `/api/auth/fetchEvents?startDate=${fetchStartDate}&endDate=${fetchEndDate}`,
    };

    const options2 = {
      method: "GET",
      url: `/api/event/skiddleEvents?startDate=${fetchStartDate}&endDate=${fetchEndDate}`,
    };

    const options3 = {
      method: "GET",
      url: `/api/event/londontheatredirect?startDate=${fetchStartDate}&endDate=${fetchEndDate}`,
    };

    // axios
    //   .all([
    //     axios.request(options1),
    //     axios.request(options2),
    //     axios.request(options3),
    //   ])
    //   .then(
    //     axios.spread((response1, response2, response3) => {
    //       if (response1.status === 200) {
    //         // setEventFetch(response1.data);
    //       }

    //       if (response2.status === 200) {
    //         // setEventFetch(response2.data);
    //       }

    //       if (response3.status === 200) {
    //         // setEventFetch(response3.data);
    //       }
    //       setFetchStartDate("")
    //       setFetchEndDate("")
    //       // setLoader(false);
    //     })
    //   )
    //   .catch(function (error) {
    //     console.error(error);
    //   }).finally(
    //     setLoader(false),
    //     setFetchStartDate(""),
    //     setFetchEndDate("")
    //   );
    const requests = [
      axios.request(options1),
      axios.request(options2),
      axios.request(options3),
    ];

    Promise.all(requests.map((request) => request.catch((error) => error)))
      .then((responses) => {
        const [response1, response2, response3] = responses;

        if (response1.status === 200) {
          // handle response1.data
        }

        if (response2.status === 200) {
          // handle response2.data
        }

        if (response3.status === 200) {
          // handle response3.data
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        // This block will be executed after all requests are complete, regardless of success or failure.
        setLoader(false);
        setFetchStartDate("");
        setFetchEndDate("");
      });
  };

  const handleClearFilter = () => {
    setLoader(true);
    setSelectedProvider("");
    setCityFilter("");
    setCategoryFilter("");
    setSubCategoryFilter("");
    setProviderFilter("");
    setStartDate("");
    setEndDate("");
    refreshData();
    setLoader(false);
  };

  // -----------cities List-----------

  const getAllCities = (page, limit) => {
    setLoader(true);
    try {
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
        .then((res) => {
          if (res.status === 200) {
            // console.log(res?.data?.events);
            const citiesName = res?.data?.events?.map((items) => items?.city);
            if (citiesName?.length > 0) {
              const filterCityArr = citiesName?.filter(
                (item, index) => citiesName?.indexOf(item) === index
              );
              setCitiesList(filterCityArr);
            }
            // setLoader(false);

            const providerName = res?.data?.events?.map(
              (items) => items?.event_provider
            );
            if (citiesName?.length > 0) {
              const filterproviderArr = providerName?.filter(
                (item, index) => providerName?.indexOf(item) === index
              );
              setProviderList(filterproviderArr);
            }
          }
        })
        .catch((err) => {
          console.log(err, "Error");
          setLoader(false);
        });
    } catch {
      console.log("error");
      setLoader(false);
    }
  };

  // const result = formatDate("2024-01-17T12:30:00Z");
  // console.log(result);
  const [mainSno, setMainSno] = useState(0);
  let Sno = mainSno;
  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer autoClose={1500} />
      <Topbar />
      <div>
        <div className="mt-2 sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:px-10 border mx-10 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold">Event List </h2>
        </div>

        {/* ---------Event fetch---------- */}
        <div className="  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border mx-10 lg:mx-8   rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[70px] lg:mt-5 sm:mt-3 mt-2 md:py-2 sm:py-[6px] py-2">
          <div className=" flex  sm:items-center flex-col-reverse sm:flex-row justify-between">
            <div className="items-center w-[50%] sm:w-[40%] my-3 sm:my-0">
              <input
                type="search"
                className=" border border-gray-500 py-[2px] lg:py-[4px] 2xl:py-3 rounded-lg w-full lg:max-w-auto max-w-[320px] mx-auto md:w-11/12 focus:outline-none md:px-[15px] px-2 text-[15px] placeholder:text-[13px]"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon1"
                onChange={handleSearch}
              />
            </div>

            <div className="flex gap-2 ">
              <div className="flex flex-wrap gap-2 mu-auto ">
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                      Start Date
                    </label>
                  </div>
                  <div>
                    <input
                      type="date"
                      value={fetchStartDate}
                      onChange={(e) => setFetchStartDate(e.target.value)}
                      className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none  
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[12px]  lg:px-2 lg:py-1  lg:w-32
                    md:px-3 md:py-2 md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px]"
                    />
                  </div>
                </div>

                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500  text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                      End Date
                    </label>
                  </div>
                  <div>
                    <input
                      type="date"
                      value={fetchEndDate}
                      onChange={(e) => setFetchEndDate(e.target.value)}
                      className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none  
                   2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[12px]  lg:px-2 lg:py-1  lg:w-32
                    md:px-3 md:py-2 md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] "
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <div>
                  <label className=" text-gray-500  text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                    External Event
                  </label>
                </div>
                <div>
                  <button
                    onClick={defaultEventFetch}
                    className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none  
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px]  2xl:w-28
                    xl:text-[12px]  xl:px-3 xl:py-0  
                    lg:text-[12px]  lg:px-2 lg:py-1  lg:w-20
                    md:px-3 md:py-1 md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] "
                  >
                    + Fetch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border mx-10 lg:mx-8    rounded-lg bg-white  lg:mt-5 sm:mt-3 mt-2 md:py-2 sm:py-[6px] py-3">
          <div className="">
            <div className="flex flex-wrap items-end  gap-2 lg:gap-3 xl:gap-3 2xl:gap-4 py-4">
              {/* -----Filter Category-------- */}

              <div>
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by Category
                    </label>
                  </div>

                  <select
                    name="category"
                    className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                    2xl:text-sm  2xl:px-3 2xl:py-0 2xl:h-[37px] 2xl:w-36 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-28 
                      lg:px-2 lg:py-1  lg:w-24 w-28
                 md:px-0 md:py-0 md:h-[25px] 
                      sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px]"
                    required
                    minLength={3}
                    maxLength={32}
                    value={categoryFilter}
                    onChange={(e) => {
                      handleSearchCategories(e);
                      // inputHandler(e);
                    }}
                  >
                    <option value="">All Category</option>
                    {Array.isArray(getAllCate) &&
                      getAllCate.map((item) => (
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
                    <label className=" text-gray-500 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by SubCategory
                    </label>
                  </div>
                  <select
                    name="subCategory"
                    className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-0 2xl:h-[37px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[12px]  lg:px-2 lg:py-1  lg:w-32
                   md:px-3 md:py- md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] "
                    required
                    minLength={3}
                    maxLength={32}
                    value={subCategoryFilter}
                    onChange={(e) => {
                      handleSearchSubCategory(e);
                      // inputHandler(e);
                    }}
                  >
                    <option value=""> All SubCategory</option>
                    {Array.isArray(allSubCategory) &&
                      allSubCategory
                        .filter((item, indr) => {
                          return item?.category?._id === filteredCategory;
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
                    <label className=" text-gray-500 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by Start Date
                    </label>
                  </div>
                  <div>
                    <input
                      name="startDate"
                      type="date"
                      max={endDate ? endDate : ""}
                      className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[12px]  lg:px-2 lg:py-1  lg:w-32
                md:px-3 md:py-2 md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] "
                      onChange={handleDateSearch}
                      value={startDate}
                    />
                  </div>
                </div>
              </div>
              {/* -----Filter End Date-------- */}

              <div className="">
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by End Date
                    </label>
                  </div>
                  <div>
                    <input
                      type="date"
                      name="endDate"
                      min={startDate ? startDate : ""}
                      className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-44 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-32
                    lg:text-[12px]  lg:px-2 lg:py-1  lg:w-32
                  md:px-3 md:py-2 md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] "
                      onChange={handleDateSearch}
                      value={endDate}
                    />
                  </div>
                </div>
              </div>

              {/* ----------Filter by City------------ */}

              <div>
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by City
                    </label>
                  </div>

                  <select
                    name="city"
                    className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                    2xl:text-sm  2xl:px-3 2xl:py-0 2xl:h-[37px] 2xl:w-36 
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-28 
                      lg:px-2 lg:py-1  lg:w-24 w-28
                 md:px-0 md:py-0 md:h-[25px] 
                      sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px]"
                    required
                    minLength={3}
                    maxLength={32}
                    onChange={(e) => {
                      handleSearchCity(e);
                      // inputHandler(e);
                    }}
                    value={cityFilter}
                  >
                    <option value="">All City</option>
                    {citiesList?.length > 0 &&
                      citiesList?.map((city) => (
                        <option
                          key={city}
                          value={city}
                          className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                        >
                          {city}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* ----------Filter by Provider------------ */}

              <div>
                <div className="">
                  <div>
                    {" "}
                    <label className=" text-gray-500 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                      Filter by Provider
                    </label>
                  </div>

                  <select
                    name="provider"
                    className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 2xl:text-sm 2xl:px-3 2xl:py-0 2xl:h-[37px] 2xl:w-36 xl:text-[12px] xl:px-3 xl:py-0 xl:w-28 lg:px-2 lg:py-1 lg:w-24 w-28 md:px-0 md:py-0 md:h-[25px] sm:px-2 sm:py-0 px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px]"
                    required
                    minLength={3}
                    maxLength={32}
                    value={providerFilter}
                    onChange={(e) => {
                      handleSearchProvider(e);
                      // inputHandler(e);
                    }}
                  >
                    <option value="">All Provider</option>
                    {providerList?.map((event_provider) => (
                      <option
                        key={event_provider}
                        value={event_provider}
                        className="2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                      >
                        {event_provider}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="">
                <div>
                  <label className=" text-gray-500  text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                    Clear Filter
                  </label>
                </div>
                <div>
                  <button
                    onClick={handleClearFilter}
                    className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none  
                  2xl:text-sm  2xl:px-3 2xl:py-2 2xl:h-[35px] 2xl:w-24
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-16
                    lg:text-[12px]  lg:px-2 lg:py-1   lg:w-16
                    md:px-3 md:py-1 md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] "
                  >
                    Clear
                  </button>
                </div>
              </div>
              {/* -----Add Event-------- */}

              <div className="">
                <div>
                  <label className=" text-gray-500  text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px]">
                    New Event
                  </label>
                </div>
                <div>
                  <button
                    onClick={openAddModal}
                    className="rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none  
                  2xl:text-sm  2xl:px-0 text-center 2xl:py-2 2xl:h-[35px] 2xl:w-24
                    xl:text-[12px]  xl:px-3 xl:py-0  xl:w-16
                    lg:text-[12px]  lg:px-2 lg:py-1  lg:w-16
                    md:px-3 md:py-1 md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] text-[9px] sm:text-[10px] md:text-[10px] "
                  >
                    +Add
                  </button>
                </div>
              </div>
            </div>
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

        <div className="relative flex mx-10 lg:mx-8  overflow-x-auto ">
          <div className="  w-full ">
            <div className="overflow-y-scroll  ">
              <div className="h-[300px] xl:h-[400px]">
                <table className="lg:w-[150%] xl:w-[130%]  border bg-white rounded-md mt-5 p-10">
                  <thead className="sticky-header">
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
                        IMAGE
                      </th>
                      <th className="xl:pl-5  w-4/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5  ">
                        EVENT NAME
                      </th>
                      <th className="lg:pl-3 xl:pl-0 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                        CITY
                      </th>
                      <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                        START DATE
                      </th>
                      <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                        END DATE
                      </th>

                      <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                        LOCATION
                      </th>
                      <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                        PROVIDER
                      </th>
                      <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                        CATEGORY
                      </th>
                      <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                        ACTION
                      </th>
                    </tr>
                  </thead>

                  {getAllEvent?.length > 0 && (
                    <tbody className=" w-full ">
                      {/* <div className=""> */}
                      {getAllEvent.map((item, index) => {
                        const serialNumber =
                          (current_page - 1) * 20 + (index + 1);

                        return (
                          <tr
                            key={item._id}
                            className="  p-2 text-start flex 2xl:text-[22px] xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[13px] text-[10px]"
                          >
                            {/* {console.log(item.category)} */}
                            <td className=" my-auto w-1/12">
                              {serialNumber + "."}
                            </td>
                            <td className="my-auto  w-2/12  text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] ">
                              <>
                                {Array.isArray(item?.images) &&
                                  item.images.length > 0 && (
                                    <>
                                      {item.images.map((img, inx) => (
                                        <div
                                          className="mt-4 cursor-pointer"
                                          key={inx}
                                          onClick={() =>
                                            handleImageClick(item?.images)
                                          }
                                        >
                                          {(img.position === 0 ||
                                            inx === 0) && (
                                            <img
                                              src={img.url}
                                              alt="loading.."
                                              height={100}
                                              width={100}
                                              className="w-2/4"
                                            />
                                          )}
                                        </div>
                                      ))}
                                    </>
                                  )}
                              </>
                            </td>
                            <td className="my-auto capitalize  w-4/12  text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-[22px]">
                              <p className="w-40">{item.name}</p>
                            </td>

                            <td className="my-auto  w-2/12  text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] 2xl:pl-0">
                              {item.city}
                            </td>
                            <td className="my-auto  w-3/12  text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-0">
                              {item?.startDate
                                ? convertTime(item.startDate)
                                : ""}
                            </td>
                            <td className="my-auto w-3/12 text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-0">
                              {item?.endDate ? convertTime(item.endDate) : ""}
                            </td>

                            <td className="my-auto  w-3/12 text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-0">
                              {item.location}
                            </td>
                            <td className="2xl:pl-2 my-auto  w-3/12 text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] xl:pl-4">
                              {item.event_provider}
                            </td>

                            <td className="my-auto  w-3/12 text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px]  2xl:pl-0 ">
                              <div className="">
                                <select
                                  name="category"
                                  defaultValue={item?.category?._id}
                                  onChange={(e) => {
                                    inputHandler(e);
                                  }}
                                  className="custom_select capitalize"
                                >
                                  <option value="">Select Category</option>

                                  {Array.isArray(getAllCate) &&
                                    getAllCate.map((itemsx) => (
                                      <option
                                        className="capitalize 2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
                                        key={itemsx._id}
                                        value={itemsx._id}
                                      >
                                        {itemsx.title}
                                      </option>
                                    ))}
                                </select>
                              </div>
                              <div className="my-1">
                                <select
                                  name="subCategory"
                                  className="custom_select capitalize"
                                  onChange={inputHandler}
                                  required
                                  minLength={3}
                                  maxLength={32}
                                  // defaultValue={item?.subCategory?._id}
                                  defaultValue={String(
                                    item?.subCategory?.title
                                  )}
                                >
                                  <option value=""> Select Sub Category</option>
                                  {Array.isArray(allSubCategory) &&
                                    allSubCategory
                                      .filter((item, indr) => {
                                        return (
                                          item?.category?._id ===
                                          editCategory?.category
                                        );
                                      })
                                      .map((itemss) => (
                                        <option
                                          className="capitalize 2xl:text-[20px] xl:text-[14px] lg:text-[12px] md:text-[10px] text-[8px]"
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

                            <td className="my-auto  w-2/12 2xl:pl-10 ">
                              <div className="flex my-3 gap-3 ">
                                {/* {console.log()} */}
                                <button
                                  onClick={() => openEditModal(item?._id)}
                                >
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
                        );
                      })}
                      {/* </div> */}
                      <hr />
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {total_pages > 1 && (
        <Pagination
          total_pages={total_pages}
          current_page={current_page}
          onPageChange={handlePageChange}
        />
      )}

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="z-10 fixed" onClose={closeModal}>
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
                <Dialog.Panel className=" w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
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

      <Transition appear show={isOpenAddEvent} as={Fragment}>
        <Dialog as="div" className="z-10 fixed" onClose={closeModal}>
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
                <Dialog.Panel className=" w-full max-w-[700px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    {" "}
                    <button
                      type="button"
                      onClick={closeModal}
                      className=" text-gray-400  shadow-2xl text-sm   top-2  inline-flex items-center justify-center "
                    >
                      <Image
                        src={cut}
                        className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
                      />
                      <span className="sr-only bg-black">Close menu</span>
                    </button>
                  </Dialog.Title>
                  <CreateEvent
                    closeModal={closeModal}
                    refreshData={refreshData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenEditEvent} as={Fragment}>
        <Dialog as="div" className="z-10 fixed" onClose={closeModal}>
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
                <Dialog.Panel className=" w-full max-w-[700px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    {" "}
                    <button
                      type="button"
                      onClick={closeModal}
                      className=" text-gray-400  shadow-2xl text-sm   top-2  inline-flex items-center justify-center "
                    >
                      <Image
                        src={cut}
                        className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
                      />
                      <span className="sr-only bg-black">Close menu</span>
                    </button>
                  </Dialog.Title>
                  <EditEvent
                    editEvent={editEvent}
                    closeModal={closeModal}
                    refreshData={refreshData}
                    editData={editData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={showLargeImage} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[111] bg-black/70"
          onClose={handleLargeImageClose}
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
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-full 2xl:max-w-[600px] md:max-w-[500px] sw-full  transform overflow-hidden rounded-[10px] bg-white py-[30px] px-[10px] xl:px-12 md:px-4 text-center align-middle shadow-xl transition-all relative">
                  <div
                    className="absolute right-2 top-1 cursor-pointer px-2 py-2 mb-4"
                    onClick={handleLargeImageClose}
                  >
                    <Image
                      src="/images/close-square.svg"
                      alt="close"
                      height={25}
                      width={25}
                    />
                  </div>
                  <ImageModal data={largeImageSrc} />
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
