import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
    const token = localStorage.getItem('SavedToken')
    return token ? children : <Navigate to="/" />
}
