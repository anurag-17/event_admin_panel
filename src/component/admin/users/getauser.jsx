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
                <label className="w-1/4">Full Name :</label>
                <h1 className="w-3/4">
                  {item?.firstname} {item?.lastname}
                </h1>
              </div>
            </div>

            <div>
              <div className="flex my-2">
                <label className="w-1/4">Email : </label>
                <h1 className="w-3/4 text-wrap">{item?.email}</h1>
              </div>
            </div>
            <div>
              <div className="flex my-2">
                <label className="w-1/4">Provider : </label>
                <h1 className="w-3/4">{item?.provider}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GetAUser;
