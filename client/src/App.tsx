import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/Products"
import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./contexts/cart-context"
import ProfilePage from "./pages/Profile"
import ProductDetailPage from "./pages/SingleProduct"
import CartPage from "./pages/Cart"
import AboutPage from "./pages/About"
import AdminDashboardPage from "./pages/Admin"
import SellerDashboardPage from "./pages/seller-dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./components/Navbar"
import CheckoutSuccess from "./pages/CheckoutSuccess"

function App() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
      </Routes>
    </CartProvider>
  )
}

export default App
