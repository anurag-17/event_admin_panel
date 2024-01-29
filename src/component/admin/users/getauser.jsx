import axios from "axios";
import React, { useEffect, useState } from "react";

const GetAUser = ({ selectedItemData, closeModal }) => {
  return (
    <>
      <div>
        {selectedItemData.map((item) => (
          <div className="custom_table_text">
            <div>
              <div className="flex my-2">
                <label className="w-1/3">Full Name :</label>
                <h1 className="w-2/3">
                  {item?.firstname} {item?.lastname}
                </h1>
              </div>
            </div>

            <div>
              <div className="flex my-2">
                <label className="w-1/3">Email : </label>
                <h1 className="w-2/3">{item?.email}</h1>
              </div>
            </div>
            <div>
              <div className="flex my-2">
                <label className="w-1/3">Provider : </label>
                <h1 className="w-2/3">{item?.provider}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GetAUser;
