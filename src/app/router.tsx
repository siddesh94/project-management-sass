import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import BoardPage from "../features/boards/BoardPage";


function LoginPage() {
    return (
        <h1>Login Page</h1>
    )
}

function DashboardPage() {
    return (
        <h1>Dashboard Page</h1>
    )
}

function ProjectsPage() {
    return (
        <h1>Projects Page</h1>
    )
}

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/app",
        element: <AppLayout />,

        children: [
            {
            index: true,
            element: <DashboardPage />,
        },
        {
            path: ":organizationId/projects",
            element: <ProjectsPage />,
        },
        {
            path: ":organizationId/projects/:projectId/board",
            element: <BoardPage />,
        }
        ]
    }
]);
