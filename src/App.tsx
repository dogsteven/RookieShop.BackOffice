import { RouterProvider } from "react-router";
import { AuthProvider } from "react-oidc-context";
import userManager from "./oidc/user-manager";
import { ThemeProvider } from "./components/theme-provider";
import router from "./router";
import "./index.css";
import { Provider } from "react-redux";
import store from "./app/redux/store";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider userManager={userManager}>
          <Toaster richColors />
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App
