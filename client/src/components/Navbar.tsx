

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Link, useLocation } from "react-router-dom"


function getAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (!auth || !auth.user) return null;
    return auth.user;
  } catch {
    return null;
  }
}

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = getAuthUser();
  const { state } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }
  return (
    <nav className="w-full bg-white flex items-center justify-between px-8 py-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="font-extrabold text-3xl tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <span className="text-yellow-400">DEAL</span> <span className="text-black">PERFECT</span>
        </Link>
      </div>
      {/* Nav Links - Home and Admin Dashboard for admin, else normal links */}
      <div className="flex-1 flex justify-center gap-10">
        <Link
          to="/"
          className={`text-black text-lg font-medium hover:underline ${location.pathname === '/' ? 'underline underline-offset-4 decoration-yellow-400 font-bold' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`text-black text-lg font-medium hover:underline ${location.pathname === '/about' ? 'underline underline-offset-4 decoration-yellow-400 font-bold' : ''}`}
        >
          About
        </Link>
        {user && user.role === 'admin' ? (
          <Link
            to="/admin"
            className={`text-black text-lg font-medium hover:underline ${location.pathname.startsWith('/admin') ? 'underline underline-offset-4 decoration-yellow-400 font-bold' : ''}`}
          >
            Admin Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/products"
              className={`text-black text-lg font-medium hover:underline ${location.pathname.startsWith('/products') ? 'underline underline-offset-4 decoration-yellow-400 font-bold' : ''}`}
            >
              Products
            </Link>
            {/* Chat link for all logged-in users except admin */}
          
            {/* Cart link only for buyers or guests */}
            {(!user || user.role !== 'seller') && (
              <Link
                to="/cart"
                className={`text-black text-lg font-medium hover:underline ${location.pathname.startsWith('/cart') ? 'underline underline-offset-4 decoration-yellow-400 font-bold' : ''}`}
              >
                Cart
              </Link>
            )}
          </>
        )}
      </div>
      {/* Icons and User Info */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex flex-col items-end mr-2">
              {user.name && user.role !== 'admin' && (
                <Link
                  to={user.role === "seller" ? "/seller-dashboard" : "/profile"}
                  className="text-black font-semibold text-base hover:underline cursor-pointer"
                >
                  {user.name}
                </Link>
              )}
              {user.role && (
                <span className="text-xs text-yellow-600 font-medium capitalize">{user.role}</span>
              )}
            </div>
            {/* Cart icon only for buyers or guests, not admin */}
            {user.role !== 'seller' && user.role !== 'admin' && (
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-7 w-7 text-black" />
                {state.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full px-2 py-0.5 border border-white shadow">
                    {state.totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-black text-yellow-400 font-semibold rounded hover:bg-yellow-600 hover:text-white transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}