import { useState, createContext, useContext } from "react";
import axiosInstance from "./axiosinstance";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(null);

    const Signup = async ({ name, email, password }) => {
        setloading(true);
        seterror(null);
        try {
            const res = await axiosInstance.post("/user/signup", {
                name,
                email,
                password,
            });
            const { data, token } = res.data;
            const userData = { ...data, token };
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            toast.success("Signup Successful");
        } catch (error) {
            const msg = error.response?.data.message || "Signup failed";
            seterror(msg);
            toast.error(msg);
        }
    };

    //Login
    const Login = async ({ email, password }) => {
        setloading(true);
        seterror(null);
        try {
            const res = await axiosInstance.post("/user/login", {
                email,
                password,
            });
            const { data, token } = res.data;
            localStorage.setItem("user", JSON.stringify({ ...data, token }));
            setUser(data);
            toast.success("Login Successful");
        } catch (error) {
            const msg = error.response?.data.message || "Login failed";
            seterror(msg);
            toast.error(msg);
        }
    };

    //LogOut
    const Logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        toast.info("Logout Successful");
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, error, Signup, Login, Logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);