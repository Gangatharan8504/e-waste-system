import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, ClipboardList, PlusCircle, LogOut } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-emerald-600 font-semibold"
      : "text-gray-600 hover:text-emerald-600";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-10 py-4 flex items-center justify-between">

      {/* LEFT SIDE (LOGO + NAV LINKS) */}
      <div className="flex items-center gap-10">

        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-emerald-700 cursor-pointer tracking-wide"
        >
          EcoSync
        </h1>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          {token && role === "USER" && (
            <>
              <Link
                to="/user/dashboard"
                className={`flex items-center gap-2 ${isActive("/user/dashboard")}`}
              >
                <Home size={16} /> Home
              </Link>

              <Link
                to="/user/create-pickup"
                className={`flex items-center gap-2 ${isActive("/user/create-pickup")}`}
              >
                <PlusCircle size={16} /> Create Pickup
              </Link>

              <Link
                to="/user/my-requests"
                className={`flex items-center gap-2 ${isActive("/user/my-requests")}`}
              >
                <ClipboardList size={16} /> My Requests
              </Link>
            </>
          )}

          {token && role === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className={`${isActive("/admin/dashboard")}`}
            >
              Manage Requests
            </Link>
          )}

        </div>
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-4">

        {/* NOT LOGGED IN */}
        {!token && (
          <>
            <Link
              to="/login"
              className="text-gray-600 hover:text-emerald-600 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm hover:scale-105"
            >
              Get Started
            </Link>
          </>
        )}

        {/* LOGGED IN */}
        {token && (
          <>
            <Link
              to="/user/profile"
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-full text-sm font-semibold group-hover:bg-emerald-700 transition shadow-sm">
                U
              </div>
              <span className="hidden md:block text-sm">
                Profile
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-500 hover:text-white transition hover:scale-105"
            >
              <LogOut size={16} />
              <span className="hidden md:block">Logout</span>
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;