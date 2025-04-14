import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

function withAdministrativeRequirement<Props extends object>(Component: React.FC<Props>) {
  return (props: Props) => {
    const auth = useAuth();
    const navigate = useNavigate();

    const roles = auth.user!.profile!.roles as string[];

    useEffect(() => {
      if (!roles.includes("admin")) {
        navigate("/");
      }
    }, [roles]);

    return <Component {...props} />
  };
}

export {
  withAdministrativeRequirement
};