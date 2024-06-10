import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Login } from "../../pages/Login/Login.js";
import { Interview } from "../../pages/Interview/Interview.js";

const router = createHashRouter([
  { path: "/", Component: Login },
  { path: "/interview", Component: Interview },
]);

export const Router = (): JSX.Element => <RouterProvider router={router} />;
