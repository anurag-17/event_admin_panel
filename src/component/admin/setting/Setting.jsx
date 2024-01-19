import React, { useState } from "react";
import Accordion from "./Accordion"; // Import your Accordion component
import Profile from "./Profile";
import ChangePassword from "./upadate-password";
import Topbar from "../../../app/admin/admin-dashboard/topbar";

const Setting = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const accordionData = [
    {
      title: "Profile",
      content: <Profile />,
      index: 0,
    },
    {
      title: "change password",
      content: <ChangePassword />,
      index: 1,
    },
  ];

  const handleAccordionToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <Topbar />
      <div className="bg-[#f3f3f3] w-full h-full lg:py-[40px] py-[20px]">
        {accordionData.map((accordion, index) => (
          <Accordion
            key={accordion.index}
            title={accordion.title}
            content={accordion.content}
            index={index}
            active={activeIndex === index}
            onToggle={handleAccordionToggle}
          />
        ))}
      </div>
    </>
  );
};

export default Setting;
