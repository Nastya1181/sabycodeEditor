import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth (props) {
    const location = useLocation();
    return props.required? props.children : <Navigate to="/authentication"  state={{ from: location }} replace/>;
}