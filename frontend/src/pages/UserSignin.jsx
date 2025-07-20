import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserSignin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginshow, setLoginshow] = useState(true);
    const navigate = useNavigate();

    async function signinuser() {
        const data = {
            email: email,
            password: password
        }

        try {
            const response = await axios.post("http://localhost:3000/user/signin", data);
            if (response.data.msg === "Invalid email") {
                alert("Invalid email");
            } else if (response.data.msg === "Incorrect password") {
                alert("Incorrect password");
            } else {
                const token = response.data.token;
                localStorage.setItem("usertoken", token);
                alert("User logged in successfully.");
                navigate('/user/home');
            }
        } catch (e) {
            console.error("Error: ", e);
        }
    }

    function forUser() {
        navigate("/user/signin");
    }

    function forAdmin() {
        navigate("/admin/signin");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {/* Login Type Selector */}
            <div className="mb-8 flex space-x-4">
                <button 
                    onClick={forUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    User Login
                </button>
                <button 
                    onClick={forAdmin}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                    Admin Login
                </button>
            </div>

            {/* Signin Form */}
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">User Signin</h1>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <button 
                        onClick={signinuser}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                        LOGIN
                    </button>
                    
                    <div className="text-center">
                        <Link 
                            to="/user/signup" 
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}