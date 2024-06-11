import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Login } from "../../pages/Login/Login.js";
import { Interviewer } from "../../pages/Interviewer/Interviewer.js";
import { Candidate } from "../../pages/Candidate/Candidate.js";

const router = createHashRouter([
  { path: "/", Component: Login },
  { path: "/interviewer", Component: Interviewer },
  { path: "/candidate", Component: Candidate },
]);

export const Router = (): JSX.Element => <RouterProvider router={router} />;
