import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import Loader from "../../loader";

const Profile = () => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [loader, setLoader] = useState(false);
  const { adminAuthToken } = useAuth();
  const verifyUserToken = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `/api/auth/verifyUserToken/${adminAuthToken}`
      );

      // console.log(res)
      setVerificationResult(res?.data?.data); 
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error verifying user token:", error);
     
    }
  };

  useEffect(() => {
    verifyUserToken();
  }, []);

  return (
    <>
      {loader && <Loader />}
      <div className="bg-[white] w-full ">
        <div className="p-4 sm:py-6 sm:px-10 shadow rounded max-w-[400px]  my-4">
          <div className="">
            <Image
              src="/images/profile.svg"
              alt="profile"
              height={100}
              width={100}
            />
          </div>

          <div className="flex gap-5 flex-col justify-center text-[16px]  ">
            <div className="flex  flex-col  sm:flex-row sm:gap-3 justify-start">
              <p className="sm:w-[100px]">Name :</p>
              <p className="font-bold">
                {verificationResult?.firstname} {verificationResult?.lastname}
              </p>
            </div>
            <div className="flex  flex-col  sm:flex-row sm:gap-3  justify-start">
              <p className="sm:w-[100px]">Email :</p>
              <p className="font-bold">{verificationResult?.email}</p>
            </div>
            <div className="flex  flex-col  sm:flex-row sm:gap-3  justify-start">
              <p className="sm:w-[100px]">Number :</p>
              <p className="font-bold">{verificationResult?.mobile}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
