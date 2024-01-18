import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../loader';

const protectedRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { adminAuthToken, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
          if (!loading && !adminAuthToken) {
            router.push('/admin-login');
          }
        };
  
        checkAuth();
      }, [adminAuthToken, loading, router])


    // return adminAuthToken ? <WrappedComponent {...props} /> : null;
    return (
        <>
          {loading ? (
            <Loader />
          ) : adminAuthToken ? (
            <WrappedComponent {...props} />
          ) : null}
        </>
      );
  };

  return Wrapper;
};

export default protectedRoute;
