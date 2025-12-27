import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { SERVER_URI, SOCKET_URI } from "../../uri/uril";
import socketIO from "socket.io-client"
const ENDPOINT = SOCKET_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })


const AuthForm = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false); // 🔥 Loading state added

    const [formData, setFormData] = useState({
        name: "",
        shop_name: "",
        phoneNumber: "",
        address: "",
        email: "",
        password: "",
    });

    const setUser = useStore((state) => state.setUser);
    const setToken = useStore((state) => state.setToken);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent double submit
        setLoading(true);

        try {
            if (isLogin) {
                const loginData = {
                    email: formData.email,
                    password: formData.password,
                };

                const response = await fetch(`${SERVER_URI}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(loginData),
                    credentials: "include",
                });

                const result = await response.json();
                setUser(result.user);
                navigate("/", { replace: true });
                if (result.success) {
                    socketId.emit("notification", {
                        user: result.user.name,
                        tittle: "login ",
                        message: "loging"

                    })

                } else {
                    console.error(`Login failed: ${result.message || "Invalid credentials"}`);
                }
            } else {
                const signupData = {
                    name: formData.name,
                    shop_name: formData.shop_name,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    email: formData.email,
                    password: formData.password,
                };

                const response = await fetch(`${SERVER_URI}/registration`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(signupData),
                });

                const result = await response.json();
                await setToken(result.activationToken);

                if (result.success) {
                    navigate("/verification", { replace: true });
                    setIsLogin(true);
                } else {
                    console.error(`Sign Up failed: ${result.message || "Try again later"}`);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false); // stop loading
        }
    };

    return (
        <div className={`flex justify-center items-center ${!isLogin ? "min-h-screen" : "h-[90vh]"} bg-gray-100 px-4`}>
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                 <div>
                        <button className={`w-full flex bg-gray-100 shadow-lg items-center justify-center text-black font-semibold cursor-pointer py-2 rounded-md transition
                            ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-black hover:text-white"}`} onClick={() => window.open(`http://localhost:8000/auth/google`, "_self")}>
                            <img src="/google.png" alt="google" className="w-7 h-7 mr-4 bg-cover" />
                            Continue with Google
                        </button>
                    </div>
                <h2 className="text-2xl font-bold text-center text-black mt-6">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-2">

                   

                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                                <input
                                    type="text"
                                    name="shop_name"
                                    value={formData.shop_name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-black text-white font-semibold py-2 rounded-md transition
                            ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"}`}
                    >
                        {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-4">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => !loading && setIsLogin(!isLogin)}
                        className={`text-black font-medium hover:underline ${loading && "opacity-50 cursor-not-allowed"}`}
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
