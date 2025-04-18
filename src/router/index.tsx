import { withAuthenticationRequired } from "react-oidc-context";
import { createBrowserRouter } from "react-router";
import { withAdministrativeRequirement } from "./hoc";
import AppLayout from "./app-layout";
import ProductDashboard from "@/screens/product-dashboard";
import CategoryDashboard from "@/screens/category-dashboard";
import CustomerDashboard from "@/screens/customer-dashboard";
import Home from "@/screens/home";
import OidcCallback from "@/oidc/callback";
import UnauthorizedErrorScreen from "@/screens/unauthorized-error";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/callback",
    Component: OidcCallback
  },
  {
    path: "/unauthorized-error",
    Component: UnauthorizedErrorScreen
  },
  {
    Component: withAuthenticationRequired(withAdministrativeRequirement(AppLayout), {
      OnRedirecting: () => <div>Redirecting...</div>,
      signinRedirectArgs: {
        redirect_uri: `http://localhost:5173/products`
      }
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
        Component: CustomerDashboard
      },
    ]
  }
]);

export default router;