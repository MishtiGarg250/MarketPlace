import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

import { useCart } from "@/contexts/cart-context"
import api from "../api/api"
export default function CartPage(){
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
    const user = getAuthUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        alert("Please login as a buyer to access the cart.");
        navigate("/login", { replace: true });
        return;
      }
      if (user.role === "seller") {
        alert("Sellers cannot access the cart. Please login as a buyer.");
        navigate("/", { replace: true });
      }
    }, [user, navigate]);
    const {state,removeItem,updateQuantity,clearCart}=useCart();
    const [isLoading,setIsLoading]=useState(false);
    const platformFeeRate = 0.05;
    const platformFee = state.totalPrice*platformFeeRate
    const finalTotal= state.totalPrice +  platformFee

    const handleQuantityChange = (id: number, newQuantity: number)=>{
        if(newQuantity < 1) return;
        updateQuantity(id,newQuantity);

    }

    const handleRemoveItem = (id: number)=>{
        removeItem(id);
    }
    
    const handleClearCart=()=>{
        if (confirm("Are you sure you want to clear your cart?")) {
      clearCart()
    }
    }


    const handleCheckout = async () => {
      setIsLoading(true);
      try {
        const res = await api.post("/stripe/stripe-session");
        if (res.data && res.data.url) {
          window.location.href = res.data.url;
        } else {
          alert("Failed to start checkout session.");
        }
      } catch (err) {
        console.log(err);
        alert("Checkout error. Please try again.");
      }
      setIsLoading(false);
    }

   if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingBag className="h-16 w-16 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-xl text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
            <a href="/products">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Start Shopping
              </Button>
            </a>
          </div>
        </div>
      </div>
    )
  }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                <p className="text-lg text-gray-600">Review your items and proceed to checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <a href="/" className="hover:text-yellow-600 transition-colors">Home</a>
              <span>&gt;</span>
              <a href="/products" className="hover:text-yellow-600 transition-colors">Products</a>
              <span>&gt;</span>
              <span className="text-gray-900 font-semibold">Cart</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Cart Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border-0 p-6">
                <div className="grid grid-cols-12 items-center border-b border-gray-200 pb-4 mb-6">
                  <div className="col-span-5 font-semibold text-gray-700 text-lg">Product</div>
                  <div className="col-span-2 font-semibold text-gray-700 text-center">Price</div>
                  <div className="col-span-3 font-semibold text-gray-700 text-center">Quantity</div>
                  <div className="col-span-1 font-semibold text-gray-700 text-center">Total</div>
                  <div className="col-span-1"></div>
                </div>
                {state.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 items-center border-b border-gray-100 last:border-b-0 py-6 hover:bg-gray-50 transition-colors rounded-lg">
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2">
                        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{item.title}</div>
                        <div className="text-sm text-gray-500">SKU: {item.id?.slice(-8)}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-bold text-gray-900 text-lg">${item.price.toFixed(2)}</div>
                    <div className="col-span-3 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={item.quantity}
                          onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                          className="w-16 text-center border-none focus:ring-0 focus:outline-none bg-transparent text-gray-900 font-semibold"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 hover:bg-gray-100"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-1 text-center font-bold text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-6">
                  <a href="/products" className="font-semibold text-yellow-600 hover:text-yellow-700 hover:underline transition-colors">Continue Shopping</a>
                  <Button
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      "Check Out"
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {/* Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Order Summary
                </div>
                <div className="text-gray-600 mb-6 text-sm">Enter your destination to get a shipping estimate</div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Country *</Label>
                    <select className="w-full h-12 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:bg-white focus:border-yellow-400 focus:ring-yellow-400 transition-colors">
                      <option>United States</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">State/Province</Label>
                    <select className="w-full h-12 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:bg-white focus:border-yellow-400 focus:ring-yellow-400 transition-colors">
                      <option>Please Select a region, state</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Zip/Postal Code</Label>
                    <input 
                      className="w-full h-12 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:bg-white focus:border-yellow-400 focus:ring-yellow-400 transition-colors" 
                      placeholder="Enter zip code" 
                    />
                  </div>
                </div>
                <div className="flex justify-between py-2 border-t mt-4">
                  <span>Sub-Total</span>
                  <span className="font-semibold">${state.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Delivery Charges</span>
                  <span className="font-semibold">$80.00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Coupan Discount</span>
                  <span className="text-blue-600 cursor-pointer">Apply Coupan</span>
                </div>
                <div className="flex justify-between py-2 border-t mt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>${(state.totalPrice + 80).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}