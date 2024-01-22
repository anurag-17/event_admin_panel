import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import OpenEye from "./svg/Openeye";
import CloseEye from "./svg/Closeeye";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../loader";
import Setting from "./Setting";

const ChangePassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [cnfmPassword, setCnfmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isError, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const auth_token = JSON.parse(localStorage.getItem("accessToken") || null);

  const togglePasswordVisibility = (passwordType) => {
    if (passwordType === "password") {
      setShowPassword(!showPassword);
    } else if (passwordType === "newPassword") {
      setShowNewPassword(!showNewPassword);
    } else if (passwordType === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const InputHandler = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = formData;

    if (oldPassword === newPassword) {
      setError("Old password and new password can't be the same");
    } else if (newPassword !== cnfmPassword) {
      setError("New password and confirm password should match");
    } else {
      try {
        setLoading(true);
        const res = await axios.post("/api/auth/updatePassword", formData, {
          headers: {
            "Content-Type": "application/json",
            authorization: auth_token,
          },
        });
        // console.log(res)
        if (res.status === 200) {
          setFormData({
            oldPassword: "",
            newPassword: "",
          });
          setCnfmPassword("");
          setError("");
          toast.success("Password change successfully!");
          handleSignout();
          // router.push("/admin-login")
        } else if (res.status === 203) {
          setError(res?.data?.message);
          setLoader(false);
          return;
        }
      } catch (error) {
        setError("Password change failed!");
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignout = () => {
    try {
      setLoader(true);
      const options = {
        method: "GET",
        url: `/api/auth/logout`,
        headers: {
          "Content-Type": "application/json",
          authorization: auth_token,
        },
      };
      axios
        .request(options)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Please login again!");
            setLoader(false);
            localStorage.removeItem("accessToken");
            router.push("/admin-login");
          } else {
            setLoader(false);
            localStorage.removeItem("accessToken");
            router.push("/admin-login");
            return;
          }
        })
        .catch((error) => {
          setLoader(false);
          console.error("Error:", error);
          toast.error(error?.response?.data?.message || "server error!");
          localStorage.removeItem("accessToken");
          router.push("/admin-login");
        });
    } catch {
      console.log("error");
      toast.error("server error!");
      localStorage.removeItem("accessToken");
      router.push("/admin-login");
    }
  };
  return (
    <>
      {loader && <Loader />}

      <ToastContainer />
      <div className="flex items-center justify-center">
        <div className="md:px-[50px] w-full mx-auto">
          <div className="relative flex flex-col 2xl:gap-x-20 xl:gap-x-10 gap-x-7 justify-center lg:shadow-none  items-center lg:flex-row space-y-8 md:space-y-0 w-[100%] px-[10px]bg-white lg:px-[40px] py-[20px] md:py-[40px] ">
            {/* <div
              className="absolute right-10 top-6 bg-[#e5f0fa] hover:bg-[#c5dcf0] px-3 py-1 rounded cursor-pointer flex items-center gap-3"
              onClick={() => router.push("/")}
            >
              Go back
            </div> */}
            <div className="w-[100%] lg:w-[60%] xl:w-[50%]">
              <form action="" className="" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 justify-center md:max-w-[80%] lg:w-full lg:max-w-[100%] mx-auto ">
                  <div className="text-left ">
                    <p className="mb-2 custom_heading_text leading-[38px] md:font-bold font-medium whitespace-nowrap">
                      Change password
                    </p>
                  </div>
                  <div className="relative flex justify-center items-center mt-6">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="oldPassword"
                      placeholder="Old password"
                      className="px-4 py-4 rounded-[10px] border  placeholder:text-[gray] w-full custom-input "
                      onChange={InputHandler}
                      minLength={8}
                      required
                    />
                    <div
                      className="absolute right-[10px] cursor-pointer"
                      onClick={() => togglePasswordVisibility("password")}
                    >
                      {showPassword ? <OpenEye /> : <CloseEye />}
                    </div>
                  </div>
                  <div className="relative flex justify-center items-center">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="New password"
                      className="px-4 py-4 rounded-[10px] border  placeholder:text-[gray] w-full mt-2 custom-input"
                      onChange={InputHandler}
                      minLength={8}
                      required
                    />
                    <div
                      className="absolute right-[10px] cursor-pointer"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showNewPassword ? <OpenEye /> : <CloseEye />}
                    </div>
                  </div>
                  <div className="relative flex justify-center items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password "
                      className="px-4 py-4 rounded-[10px] border  placeholder:text-[gray] w-full mt-2 custom-input"
                      onChange={(e) => setCnfmPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                    <div
                      className="absolute right-[10px] cursor-pointer"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                    >
                      {showConfirmPassword ? <OpenEye /> : <CloseEye />}
                    </div>
                  </div>
                  {isError && (
                    <p className="text-[red] mt-2 px-2 text-[14px] lg:text-[13px] font-normal bg-[#f0e3e3] py-1    rounded-[4px]">
                      {isError}
                    </p>
                  )}
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#1f2432] font-medium text-[15px] text-white p-2 rounded-lg hover:border hover:border-black h-[50px]  hover:bg-[#fff] hover:text-black"
                    >
                      {isLoading ? "Loading.." : "Change password"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
