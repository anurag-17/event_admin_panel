"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "../../loader";
import { useAuth } from "../../../contexts/AuthContext";

const UserProfile = () => {
  const {userAuthToken} = useAuth() 
  const [isLoader, setIsLoader] = useState(false);
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const [authenticated,setAuthenticated]=useState(false);
  
  const goBackToUser=()=>{
    router.push("/user");
  }

  useEffect(() => {

    if (userAuthToken) {
      verify();
    } else {
      router.push("/user/login");
    }
  }, []);

  const verify = async () => {
    setIsLoader(true);
    try {
      const res = await axios.get(`/api/auth/verifyUserToken/${userAuthToken}`);
      if (res.status === 200) {
        setAuthenticated(true);
        setIsLoader(false);
        setUserData(res?.data?.data);
      } else {
        setAuthenticated(false);
        router.push("/user/login");
        setIsLoader(false);
      }
    } catch (error) {
      setAuthenticated(false);
      console.error("Error occurred:", error);
      router.push("/user/login");
      setIsLoader(false);
    }
  };

  

  return (
    <>
    {isLoader && <Loader/>}
    <div className="bg-gray-100 h-screen p-4">
    <div className="flex justify-end mb-2"><button className=" border rounded-md text-[12px] border-gray-400 px-2 py-1" onClick={goBackToUser}>Go Back</button></div>
    <div className=" bg-white border border-gray-100 rounded-md flex justify-center text-[22px] font-bold">User Profile</div>
 <div className=" flex items-center justify-center">

  <div className="bg-white border border-gray-300 p-4 mt-4 rounded-md">
    
    {userData && (
      <div>
        <div className="flex mb-2">
          <p className="sm:w-26  mr-2">First Name:</p>
          <div>{userData?.firstname}</div>
        </div>
        <div className="flex mb-2">
          <p className="sm:w-26 mr-2">Last Name:</p>
          <div>{userData?.lastname}</div>
        </div>
        <div className="flex mb-2">
          <p className="sm:w-[87px] w-[50px] mr-2">Email:</p>
          <div>{userData?.email}</div>
        </div>
        <div className="flex mb-2">
          <p className="sm:w-26 mr-2">Mobile No.:</p>
          <div>{userData?.mobile}</div>
        </div>
      </div>
    )}
  </div>
</div>
</div>

    </>
  );
};

export default UserProfile;
