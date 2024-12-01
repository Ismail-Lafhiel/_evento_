import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authService } from "./services/auth.service";

function App() {
  authService.setupAxiosInterceptors();
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
