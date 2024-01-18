"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [adminAuthToken, setAdminAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);

  const setAuthToken = (newToken) => {
    setAdminAuthToken(newToken);
    setCookie(null, "ad_Auth", JSON.stringify(newToken), {
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    });
  };

  // Function to clear authentication token on logout
  const handleSignout = async (customToastSuccess, customToastError) => {
    try {
      setLoader(true);

      const options = {
        method: "GET",
        url: `/api/auth/logout`,
        headers: {
          "Content-Type": "application/json",
          authorization: adminAuthToken,
        },
      };

      const response = await axios.request(options);

      if (response.status === 200) {
        customToastSuccess("Logout!");
      } else {
        customToastError(response?.data?.message || "Logout failed!");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error:", error);
      customToastError(error?.response?.data?.message || "Server error!");
      setLoader(false);
    } finally {
      // localStorage.removeItem("accessToken");
      destroyCookie(null, "ad_Auth", { path: "/" });
      router.push("/admin-login");
      setLoader(false);
    }
  };


  useEffect(() => {
    const fetchToken = async () => {
      if (typeof window !== "undefined") {
        const storedToken = parseCookies()?.ad_Auth;
        if (storedToken) {
          setAdminAuthToken(JSON.parse(storedToken));
        }
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ adminAuthToken, setAuthToken, loading,handleSignout ,loader}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
