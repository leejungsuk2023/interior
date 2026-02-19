import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { LandingPage } from "./pages/LandingPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { EstimatePage } from "./pages/EstimatePage";
import { AdminPage } from "./pages/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "portfolio", Component: PortfolioPage },
      { path: "estimate", Component: EstimatePage },
      { path: "admin", Component: AdminPage },
    ],
  },
]);
