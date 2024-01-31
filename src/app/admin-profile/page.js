"use client";
import React from "react";
import Profile from "../../component/admin/setting/Profile";
import Topbar from "../admin/admin-dashboard/topbar";
import { useRouter } from "next/navigation";
import protectedRoute from "../../component/utils/withAuth";

const AdminProfile = () => {
  const router = useRouter();
  const goToHome = () => {
    router.push("/admin/admin-dashboard");
  };
  return (
    <>
      <div className="bg-[#F3F3F3] h-screen">
        <Topbar />
        <div className="flex items-center justify-end mt-2 mr-1">
          <button
            onClick={goToHome}
            className="flex items-center border border-gray-400 hover:bg-gray-200 text-[9px] md:text-[14px] px-2 py-1 rounded"
          >
            <img src="/images/leftarrow.svg" className="mr-1 w-[12px] md:w-5" />
            Go Back
          </button>
        </div>

        <div className="flex justify-center rounded">
          <div className="w-[247px]  sm:w-[353px] lg:w-[401px] ">
            <Profile />
          </div>
        </div>
      </div>
    </>
  );
};

export default protectedRoute(AdminProfile);
