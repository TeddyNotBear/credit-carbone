import { RouteObject } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import UcoView from "./views/UcoView";
import ProfileView from "./views/ProfileView";
import SccView from "./views/SccView";
import HomeView from "./views/HomeView";
import MarketplaceView from "./views/MarketplaceView";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'home',
                element: <HomeView />,
            },
            {
                path: 'uco',
                element: <UcoView />,
            },
            {
                path: 'scc',
                element: <SccView />,
            },
            {
                path: 'marketplace',
                element: <MarketplaceView />,
            },
            {
                path: 'profile',
                element: <ProfileView />,
            }
        ],
    },
];

export default routes;