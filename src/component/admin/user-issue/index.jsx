import React, { useEffect, useState } from "react";
import axios from "axios";

const UserIssue = () => {
  const [getUserIssue, setGetUserIssue] = useState([]);

  useEffect(() => {
    defaultGetIssue();
  }, []);

  const defaultGetIssue = () => {
    const auth_token = localStorage.getItem("accessToken" || "");

    const option = {
      method: "GET",
      url: "http://localhost:4000/api/issue/getAllEventIssues",
     
    };
    axios
      .request(option)
      .then((response) => {
        setGetUserIssue(response?.data);
        console.log(response?.data, "issue");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  return (
    <>
      <div>UserIssue</div>
    </>
  );
};

export default UserIssue;
