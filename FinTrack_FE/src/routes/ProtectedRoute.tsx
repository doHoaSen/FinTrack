import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { JSX } from "react";

type Props = {
    children: JSX.Element;
}

function ProtectedRoute({children}: Props){
    const accessToken = useAuthStore((s) => s.accessToken);
    if (!accessToken){
        return <Navigate to ="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;