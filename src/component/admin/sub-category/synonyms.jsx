import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Synonyms = (editData, closeDrawer, refreshData, isLoadingBtn) => {
  const [isLoading, setLoading] = useState(false);
  const { adminAuthToken } = useAuth();
  const [getallSynonyms, setGetallSynonyms] = useState("");
  const [getallSubCategory, setGetallSubCategory] = useState();
  const subValue = editData?.editData?.subCategory;
  const parentId = editData?.cateEdit;
  const [synonymsDetails, setSynonymsDetails] = useState({
    parentId: "",
    childId: editData?.cateEdit,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(synonymsDetails);
    try {
      if (synonymsDetails.parentId === synonymsDetails.childId) {
        return alert("same");
      }
      await axios
        .post("/api/auth/duplicate/create", synonymsDetails, {
          headers: {
            "Content-Type": "application/json",
            authorization: adminAuthToken,
          },
        })
        .then((res) => {
          console.log(res.data.success);
          if (res.data.success) {
            refreshData();
            closeDrawer();
            toast.success("Synonyms created Successfully!");
          } else {
            toast.error("Failed to create Synonyms. Server error!");
            console.log(res);
          }
        })
        .catch((e) => {
          console.log(e);
        });

      // if (status === 200) {
      //   toast.success("SubCategory Updated Successfully!");
      //   closeDrawer();
      //   refreshData();
      // } else {
      //   toast.error("Failed to update SubCategory. Server error!");
      // }
    } catch (error) {
      console.error(error);
      toast.error("Failed. Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    defaultSubCategory();
   
  }, []);

  const defaultSubCategory = () => {
    setLoading(true);
    const option = {
      method: "GET",
      url: "/api/subCategory/getallSubCategory",
    };
    axios
      .request(option)
      .then((response) => {
        setGetallSubCategory(response?.data?.subCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error, "Error");
      });
  };
  return (
    <div>
      {" "}
      <div>
        <form
          onSubmit={handleUpdate}
          className="bg-white border rounded-lg 2xl:p-2 xl:p-2 lg:p-1 md:p-2 p-1 mx-auto"
        >
          <div>
            <label className="custom_input_label">Synonyms</label>
            <input
              defaultValue={subValue}
              className="custom_inputt capitalize"
              disabled
            />
          </div>

          <div>
            <label className="custom_input_label">Parent Sub Category:</label>
            <select
              //   type="text"
              name="parentId"
              className="custom_inputt custom_dropdown_text"
              value={synonymsDetails?.childparentIdId}
              required
              onChange={(e) => {
                setSynonymsDetails({
                  ...synonymsDetails,
                  [e.target.name]: e.target.value,
                });
              }}
            >
              {isLoadingBtn ? (
                <option value="" disabled className="custom_dropdown_text py-5">
                  Loading.....
                </option>
              ) : (
                <>
                  <option value="" disabled className="custom_dropdown_text">
                    Select Synonyms
                  </option>
                  {Array.isArray(getallSubCategory) &&
                    getallSubCategory?.length > 0 &&
                    getallSubCategory?.map((item) => (
                      <option
                        key={item?._id}
                        value={item?._id}
                        className="custom_dropdown_text"
                      >
                        {item?.subCategory}
                      </option>
                    ))}
                </>
              )}
            </select>
          </div>
          <div className="flex justify-center">
            <button type="submit" disabled={isLoading} className="custom_btn">
              {isLoading ? "Loading..." : "Create Synonyms"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Synonyms;
