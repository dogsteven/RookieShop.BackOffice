import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

function OidcCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }

    if (auth.error) {
      navigate("/");
      return;
    }

    if (auth.isAuthenticated) {
      navigate("/products");
      return;
    }
  }, [auth, navigate]);

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">Loading...</div>
  );
}

export default OidcCallback;