import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

function withAdministrativeRequirement<Props extends object>(Component: React.FC<Props>) {
  return (props: Props) => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (auth.user?.profile?.roles) {
        const roles = auth.user.profile.roles as string[];
        
        if (!roles.includes("admin")) {
          navigate("/unauthorized-error");
        }
      }

      console.log(auth.user?.access_token);
    }, [auth, navigate]);

    return <Component {...props} />
  };
}

export {
  withAdministrativeRequirement
};