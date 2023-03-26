import { RouteObject } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout /> ,
        children: [

        ],
    },
];

export default routes;