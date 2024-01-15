"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = ({ params }) => {
  const router = useRouter();
  const eventIssue = params?.slug || "";
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));

  const [getaEvent, setGetaEvent] = useState([]);

  const defaultevent = () => {
    const option = {
      method: "POST",
      url: "/api/issue/getEventIssue",
      id: eventIssue,
      headers: {
        authorization: auth_token,
      },
    };
    axios.request(option).then((response) => {
      setGetaEvent(response.data);
      console.log(response.data, "issueejh");
    });
  };

  return <div>gggg</div>;
};

export default Page;
