import { useState } from "react"

import { Button } from "@/components/ui/button"

import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

import { useCart } from "@/contexts/cart-context"
import api from "../api/api"
export default function CartPage(){
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
  <div className="min-h-screen bg-white">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-yellow-400 mb-6" />
            <h1 className="font-space-grotesk text-3xl font-bold text-black mb-4">Your cart is empty</h1>
            <p className="text-xl text-yellow-500 mb-8">Looks like you haven't added anything to your cart yet</p>
            <a href="/products">
              <Button size="lg" className="text-lg px-8 bg-yellow-400 text-black hover:bg-yellow-500">Start Shopping</Button>
            </a>
          </div>
        </div>
      </div>
    )
  }
    return (
      <div className="min-h-screen bg-[#f7fafd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">Cart Page</h1>
            <div className="flex items-center gap-2 text-gray-400 text-base">
              <a href="/" className="hover:text-black">Home</a>
              <span>&gt;</span>
              <span className="text-black font-semibold">Cart Page</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="grid grid-cols-12 items-center border-b pb-4 mb-4">
                  <div className="col-span-5 font-semibold text-gray-500">Product</div>
                  <div className="col-span-2 font-semibold text-gray-500 text-center">Price</div>
                  <div className="col-span-3 font-semibold text-gray-500 text-center">Quantity</div>
                  <div className="col-span-1 font-semibold text-gray-500 text-center">Total</div>
                  <div className="col-span-1"></div>
                </div>
                {state.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 items-center border-b last:border-b-0 py-4">
                    <div className="col-span-5 flex items-center gap-4">
                      <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium text-gray-700">{item.title}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-semibold text-black">${item.price.toFixed(2)}</div>
                    <div className="col-span-3 flex justify-center">
                      <div className="flex items-center border rounded-lg bg-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-2"
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
                          className="w-12 text-center border-none focus:ring-0 focus:outline-none bg-transparent text-black font-semibold"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-2"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-1 text-center font-semibold text-black">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-6">
                  <a href="/products" className="font-semibold text-blue-600 hover:underline">Continue Shopping</a>
                  <Button
                    className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Check Out"}
                  </Button>
                </div>
              </div>
            </div>
            {/* Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="text-xl font-bold text-black mb-4">Summary</div>
                <div className="text-gray-500 mb-4">Enter your destination to get a shipping estimate</div>
                <div className="mb-3">
                  <label className="block text-gray-700 font-semibold mb-1">Country *</label>
                  <select className="w-full border rounded-lg px-3 py-2 bg-gray-50">
                    <option>United States</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 font-semibold mb-1">State/Province</label>
                  <select className="w-full border rounded-lg px-3 py-2 bg-gray-50">
                    <option>Please Select a region, state</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 font-semibold mb-1">Zip/Postal Code</label>
                  <input className="w-full border rounded-lg px-3 py-2 bg-gray-50" placeholder="Zip/Postal Code" />
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