import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/Products"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { CartProvider } from "./contexts/cart-context"
import ProfilePage from "./pages/Profile"
import ProductDetailPage from "./pages/SingleProduct"
import CartPage from "./pages/Cart"
import AdminDashboardPage from "./pages/Admin"
import SellerDashboardPage from "./pages/seller-dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./components/Navbar"
import CheckoutSuccess from "./pages/CheckoutSuccess"
import AboutPage from "./pages/About"

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

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);
  const user = getAuthUser();
  
  const adminGuard = (element: React.ReactElement) => {
    if (user && user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return element;
  };
  return (
    <CartProvider>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={adminGuard(<ProductsPage />)} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products/:id" element={adminGuard(<ProductDetailPage />)} />
        <Route path="/cart" element={adminGuard(<CartPage />)} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/checkout-success" element={adminGuard(<CheckoutSuccess />)} />
        
      </Routes>
    </CartProvider>
  )
}

export default App
