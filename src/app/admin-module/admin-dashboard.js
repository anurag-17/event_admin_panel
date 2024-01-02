import React from "react";
import dashboard from "../../../public/images/dashboard.svg";
import eventadd from "../../../public/images/event-add.svg";
import eventlist from "../../../public/images/event-list.svg";
import setting from "../../../public/images/setting.svg";
import inquiry from "../../../public/images/enquiry.svg";

import Image from "next/image";

export const menulist = [
  {
    id: 1,
    label: "Dashboard",
    component: "",
    icon: dashboard,
  },
  {
    id: 2,
    label: "Add Event",
    component: "",
    icon: eventadd,
  },
  {
    id: 3,
    label: "Event List",
    component: "",
    icon: eventlist,
  },
//   {
//     id: 4,
//     label: "Enquiry",
//     component: "",
//     icon: inquiry,
//   },
  {
    id: 4,
    label: "Setting",
    component: "",
    icon: setting,
  },
];

const AdminDashboard = () => {
//   const [showDrawer, setShowDrawer] = useState(false);

  return (
    <section className="">
      <div className="flex min-h-screen relative lg:static">
        <div className="py-2 px-3  absolute top-4 left-2 flex flex-col gap-[5px] cursor-pointer lg:hidden"
        //   onClick={() => setShowDrawer(true)}
        >
          <div className="bg-black h-[2px] w-[20px]"></div>
          <div className="bg-black h-[2px] w-[20px]"></div>
          <div className="bg-black h-[2px] w-[20px]"></div>
        </div>
        <div
          className="flex flex-col justify-between min-h-screen lg:py-[70px] xl:py-[60px] 2xl:py-[100px] py-[10px] text-white bg-black 
        xl:w-[22%] lg:w-[23%]"
        >
          <div className="">
            <div className="flex justify-center items-center whitespace-pre-wrap ">
              <h1 className="2xl:text-[35px] lg:text-[18px] text-[24px] font-semibold  text-center whitespace-nowrap">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="flex flex-col 2xl:gap-6 gap-3 ">
            {menulist.map((item, index) => (
              <div
                className="pl-6 py-3 mx-5 rounded-md  flex gap-x-3 items-center cursor-pointer  transition-colors font-semibold dash-menu  hover:transition-all ease-in delay-100 duration-300  hover:bg-gray-700 2xl:text-[25px] xl:text-[16px] lg:text-[14px] "
                // key={index}
                // className={`pl-6 py-3 mx-5 rounded-md  flex gap-x-3 items-center cursor-pointer  transition-colors font-semibold dash-menu  hover:transition-all ease-in delay-100 duration-300
                //                     ${
                //                       item.id === ComponentId
                //                         ? "bg-menu_secondary"
                //                         : "hover:menu_secondary hover:text-white hover:rounded-md"
                //                     }  `}
                // onClick={() => handleClick(item.id)}
              >
                {" "}
                <Image
                  src={item?.icon}
                  alt={item.label}
                  height={30}
                  width={30}
                  className="h-[20px] w-[20px] xl:h-[20px] xl:w-[20px] 2xl:h-[30px] 2xl:w-[30px] fill-white"
                />
                <p className=" capitalize whitespace-nowrap ">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="">
            <div>
              <div className="pl-6 py-3 mx-5 rounded text-center cursor-pointer my-3 flex items-center transition-colors dash-menu gap-x-3  font-semibold hover:bg-menu_secondary hover:text-white hover:rounded-md  hover:bg-gray-700 xl:text-[16px] 2xl:text-[25px] lg:text-[14px]">
                <p>Sign Out</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#f3f3f3] w-full"></div>
      </div>
    </section>
  );
};

export default AdminDashboard;
