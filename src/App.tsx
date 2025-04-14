import { RouterProvider } from "react-router";
import { AuthProvider } from "react-oidc-context";
import userManager from "./oidc/user-manager";
import { ThemeProvider } from "./components/theme-provider";
import router from "./router";
import "./index.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider userManager={userManager}>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
