import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function forUser() {
    navigate("/user/signin");
  }

  function forAdmin() {
    navigate("/admin/signin");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Welcome</h1>
        <p className="text-center text-gray-600">Please select your login option</p>
        <div className="flex flex-col space-y-4">
          <button 
            onClick={forUser}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            User Login
          </button>
          <button 
            onClick={forAdmin}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}