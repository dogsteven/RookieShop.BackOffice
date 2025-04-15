import { withAuthenticationRequired } from "react-oidc-context";
import { createBrowserRouter } from "react-router";
import { withAdministrativeRequirement } from "./hoc";
import AppLayout from "./app-layout";
import ProductDashboard from "@/screens/product-dashboard";
import CategoryDashboard from "@/screens/category-dashboard";

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
        Component: ProductDashboard
      },
      {
        path: "/categories",
        Component: CategoryDashboard
      },
      {
        path: "/customers",
        element: <div>Customers!</div>
      },
    ]
  }
]);

export default router;