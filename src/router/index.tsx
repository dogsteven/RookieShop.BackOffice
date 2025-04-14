import { withAuthenticationRequired } from "react-oidc-context";
import { createBrowserRouter } from "react-router";
import { withAdministrativeRequirement } from "./hoc";
import AppLayout from "./app-layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home</div>
  },
  {
    Component: withAuthenticationRequired(withAdministrativeRequirement(AppLayout), {
      OnRedirecting: () => <div>Redirecting...</div>
    }),
    children: [
      {
        path: "/products",
        element: <div>Products</div>
      },
      {
        path: "/categories",
        element: <div>Categories</div>
      },
      {
        path: "/customers",
        element: <div>Customers!</div>
      },
    ]
  }
]);

export default router;