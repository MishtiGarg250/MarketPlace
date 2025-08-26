import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"

import { useCart } from "@/contexts/cart-context"
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

    const handleCheckout= ()=>{
        setIsLoading(true);
        setTimeout(()=>{
            setIsLoading(false);
            window.location.href="/checkout"
        },1000)
    }

   if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="font-space-grotesk text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-xl text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet</p>
            <a href="/products">
              <Button size="lg" className="text-lg px-8">
                Start Shopping
              </Button>
            </a>
          </div>
        </div>
      </div>
    )
  }
    return(
        <div className="min-h-screen bg-background">
    

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-space-grotesk text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {state.totalItems} {state.totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive bg-transparent"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <a href={`/products/${item.id}`}>
                            <h3 className="text-lg font-semibold hover:text-primary transition-colors">{item.title}</h3>
                          </a>
                          <p className="text-muted-foreground">by {item.seller}</p>
                          <Badge className="mt-1 bg-primary text-primary-foreground">{item.category}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-3"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-sm text-muted-foreground">{item.stock} available</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({state.totalItems} items)</span>
                  <span>${state.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <div className="text-center">
                  <a href="/products" className="text-primary hover:underline">
                    Continue Shopping
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    )
}