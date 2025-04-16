import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";

function Home() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <>
        <Button onClick={() => auth.signoutRedirect()}>
          Sign out
        </Button>

        {auth.user?.access_token}
      </>
    );
  }

  return (
    <Button onClick={() => auth.signinRedirect()}>
      Sign in
    </Button>
  )
}

export default Home;