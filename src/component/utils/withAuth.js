import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../loader";
import axios from "axios";

const protectedRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { adminAuthToken, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(loading);
    const [isAuth, setIsAuth] = useState(false);
    

    useEffect(() => {
      const checkAuth = () => {
        if (!loading) {
          
          if (!adminAuthToken) {
            router.push("/admin-login");
          }else {
           
            verify();
          } 
        }
      };

      checkAuth();
    }, [adminAuthToken, loading, router]);

    const verify = async () => {
      setIsAuth(false);
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/auth/verifyUserToken/${adminAuthToken}`
        );
        console.log(response);
        if (response?.data === null) {
          router.push("/admin-login");
          setIsLoading(false);
        }
        if (response.status === 200||response.status === 304)  {
          setIsAuth(true);
          setIsLoading(false);
          return;
        } else {
          router.push("/admin-login");
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error occurred:", error);
        router.push("/admin-login");
      }
    };
    // return adminAuthToken ? <WrappedComponent {...props} /> : null;
    return (
      <>
        {loading || isLoading ? (
          <Loader />
        ) : adminAuthToken && isAuth ? (
          <WrappedComponent {...props} />
        ) : null}
      </>
    );
  };

  return Wrapper;
};

export default protectedRoute;
