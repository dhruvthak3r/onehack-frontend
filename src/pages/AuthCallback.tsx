import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const AuthCallback = () => {
  const { handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      await handleRedirectCallback();
      navigate("/"); // or any page you want
    };

    processAuth();
  }, []);

  return <div>Logging in...</div>;
};

export default AuthCallback;
