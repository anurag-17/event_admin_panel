"use client";
// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { parseCookies, setCookie } from "nookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminAuthToken, setAdminAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //   const [userAuthToken, setUserAuthToken] = useState(null);

  console.log(adminAuthToken);
  const setAuthToken = (newToken) => {
    setAdminAuthToken(newToken);
    setCookie(null, "ad_Auth", JSON.stringify(newToken), {
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // This code will run only on the client side
      const storedToken = parseCookies().ad_Auth;
      if (storedToken) {
        setAdminAuthToken(JSON.parse(storedToken));
        setLoading(false);
        console.log(JSON.parse(storedToken));
      }
    }
  }, []);
  return (
    <AuthContext.Provider value={{ adminAuthToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
