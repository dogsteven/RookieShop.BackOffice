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
import ImageGalleryDashboard from "@/screens/image-gallery-dashboard";
import StockDashboard from "@/screens/stock-dashboard";

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
      OnRedirecting: () => {
        return (
          <div className="flex flex-row w-full h-screen justify-center items-center">
            Redirecting...
          </div>
        );
      },
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
        path: "/stock",
        Component: StockDashboard
      },
      {
        path: "/categories",
        Component: CategoryDashboard
      },
      {
        path: "/customers",
        Component: CustomerDashboard
      },
      {
        path: "/image-gallery",
        Component: ImageGalleryDashboard
      }
    ]
  }
]);

export default router;