import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

function UnauthorizedErrorScreen() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user?.profile?.roles) {
      const roles = auth.user.profile.roles as string[];

      if (roles.includes("admin")) {
        navigate("/products");
      }
    }
  }, [auth]);

  return (
    <div className="flex flex-row w-full h-screen justify-center items-center">
      <p>You're not authorized to use this app!</p>

      <Button className="ms-4" variant={"destructive"} onClick={() => auth.signoutRedirect()}>
        Sign out
      </Button>
    </div>
  );
}

export default UnauthorizedErrorScreen;