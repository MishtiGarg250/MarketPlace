import { useEffect } from "react"
import api from "../api/api"
import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccess() {
  const navigate = useNavigate()
  useEffect(() => {
    // Call backend to create transaction and clear cart
    const completeOrder = async () => {
      try {
        await api.post("/stripe/mock-complete");
      } catch (err) {
        // Optionally handle error
        // console.error("Order completion error", err);
      }
    };
    completeOrder();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-lg text-muted-foreground mb-6">Thank you for your purchase. Your order is being processed.</p>
      <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
    </div>
  )
}
