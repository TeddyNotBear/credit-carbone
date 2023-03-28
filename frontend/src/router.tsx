import { RouteObject } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import UcoView from "./views/UcoView";
import ProfileView from "./views/ProfileView";
import SccView from "./views/SccView";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout /> ,
        children: [
            {
                path: 'uco',
                element: <UcoView />,
            },
            {
                path: 'scc',
                element: <SccView />,
            },
            {
                path: 'profile',
                element: <ProfileView />,
            }
        ],
    },
];

export default routes;