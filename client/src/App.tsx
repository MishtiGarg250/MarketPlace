import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/Products"
import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./contexts/cart-context"
function App() {

  return (
    <CartProvider>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
    </CartProvider>
    
      

  
  )
}

export default App
