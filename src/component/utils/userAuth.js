import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../loader";
import axios from "axios";

const userRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { userAuthToken, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(loading);
    const [isAuth, setIsAuth] = useState(false);
    

    useEffect(() => {
      const checkAuth = () => {
        if (!loading) {
          
          if (!userAuthToken) {
            router.push("/user/login");
          }else {
           
            verify();
          } 
        }
      };

      checkAuth();
    }, [userAuthToken, loading, router]);

    const verify = async () => {
      setIsAuth(false);
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/auth/verifyUserToken/${userAuthToken}`
        );
        if (response?.data === null) {
          router.push("/user/login");
          setIsLoading(false);
        }
        if (response.status === 200||response.status === 304)  {
          setIsAuth(true);
          setIsLoading(false);
          return;
        } else {
          router.push("/user/login");
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error occurred:", error);
        router.push("/user/login");
      }
    };
    // return userAuthToken ? <WrappedComponent {...props} /> : null;
    return (
      <>
        {loading || isLoading ? (
          <Loader />
        ) : userAuthToken && isAuth ? (
          <WrappedComponent {...props} />
        ) : null}
      </>
    );
  };

  return Wrapper;
};

export default userRoute;
