import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/Products"
import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./contexts/cart-context"
import ProfilePage from "./pages/Profile"
import ProductDetailPage from "./pages/SingleProduct"
import CartPage from "./pages/Cart"
import AboutPage from "./pages/About"
function App() {

  return (
    <CartProvider>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/products/:id" element={<ProductDetailPage/>}/>
      <Route path="/cart" element={<CartPage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
    </Routes>
    </CartProvider>
    
      

  
  )
}

export default App
