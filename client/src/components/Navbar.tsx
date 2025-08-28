import { Button } from "@/components/ui/button"
import { ShoppingCart, User } from "lucide-react"

export default function Navbar() {
  return (
  <nav className="w-full bg-white flex items-center justify-between px-8 py-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <span className="font-extrabold text-3xl tracking-widest" style={{fontFamily: 'monospace'}}>
          <span className="text-yellow-400">DEAL</span> <span className="text-black">PERFECT</span>
        </span>
      </div>
      {/* Nav Links */}
      <div className="flex-1 flex justify-center gap-10">
        <a href="#" className="text-black text-lg font-medium hover:underline">Home</a>
        <a href="#" className="text-black text-lg font-medium hover:underline">Products</a>
        <a href="#" className="text-black text-lg font-medium hover:underline">Cart</a>
        <a href="#" className="text-black text-lg font-medium hover:underline">Reviews</a>
        <a href="#" className="text-black text-lg font-medium hover:underline">Give 20%, Get 20%</a>
      </div>
      {/* Icons and CTA */}
      <div className="flex items-center gap-4">
        <User className="h-7 w-7 text-black" />
        <ShoppingCart className="h-7 w-7 text-black" />
        <Button className="rounded-full bg-yellow-400 text-black px-6 py-2 text-lg font-semibold hover:bg-yellow-500">Bundle & save</Button>
      </div>
    </nav>
  )
}