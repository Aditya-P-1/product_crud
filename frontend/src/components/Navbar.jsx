import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="bg-white shadow px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

      <h1 className="text-2xl font-bold text-blue-600">
        Product Dashboard
      </h1>

      <div className="flex items-center gap-3 flex-wrap">

        {isAuthenticated ? (
          <>
            <p className="font-medium text-gray-700">
              Welcome, {user?.email}
            </p>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Register
            </Link>
          </>
        )}

      </div>
    </div>
  )
}

export default Navbar