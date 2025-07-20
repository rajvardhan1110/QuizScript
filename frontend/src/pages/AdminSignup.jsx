import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export default function AdminSignup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registershow, setRegistershow] = useState(true);
    const navigate = useNavigate();

    async function signupadmin() {
        const data = {
            name: name,
            email: email,
            password: password
        }

        try {
            const response = await axios.post("http://localhost:3000/admin/signup", data);
            if (response.data.msg === "invalid format") {
                alert("invalid input format");
            } else if (response.data.msg === "User already exists") {
                alert("User already exists");
            } else if (response.data.msg === "successfully admin signed up") {
                alert("successfully admin signed up");
                navigate("/admin/home");
            }
        } catch (e) {
            console.error("Error: ", e);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {/* Admin Signup Form */}
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Signup</h1>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <button 
                        onClick={signupadmin}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                        Register
                    </button>
                    
                    <div className="text-center">
                        <Link 
                            to="/admin/signin" 
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                            Already have an admin account? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}