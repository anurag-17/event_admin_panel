import React from "react";
import Image from "next/image";

const Profile = () => {
  return (
    <div className="bg-[white] w-full h-full">
      <div className="py-6 px-10 shadow rounded max-w-[400px]  my-4">
        <div className="">
          <Image src="/images/profile.svg" alt="profile" height={100} width={100}/>
        </div>

        <div className="flex gap-5 flex-col justify-center text-[16px] px-10 ">
          <div className="flex justify-between">
            <p className="">Name :</p>
            <p className="font-bold">Admin</p>
          </div>
          <div className="flex justify-between">
            <p className="">Email :</p>
            <p className="font-bold">admin@gmail.com</p>
          </div>
          <div className="flex justify-between">
            <p className="">Number :</p>
            <p className="font-bold">7896543210</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
