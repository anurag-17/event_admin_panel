"use client"
import React, { useState ,useEffect} from "react";
import AdminDashboard from "./admin/admin-dashboard/page";
import Login from "./auth/[login]/page";

const page = () => {
  const [token, setToken] = useState(
    localStorage?.getItem("accessToken" )
   );
  const [authenticated, setAuthenticated] = useState(false);
  const [isRefresh, setRefresh] = useState(false);

  console.log(token,authenticated)

  const refreshData = () => {
    setRefresh(!isRefresh);
    decodeURIComponent
  };

  useEffect(() => {
    const authToekn = token ? JSON.parse(token) : null;
    if (authToekn) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [isRefresh]);

  return <div>{authenticated ? <AdminDashboard /> : <Login />}</div>;
};

export default page;
