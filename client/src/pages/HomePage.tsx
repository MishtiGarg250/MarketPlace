
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function HomePage() {
  return (
  <div className="min-h-screen bg-white flex flex-col">
      {/* Top Announcement Bar */}
      <div className="w-full bg-black text-yellow-400 text-center py-2 text-xs font-medium tracking-wide">
        Welcome to Deal Perfect: The Marketplace to Buy & Sell Anything!
      </div>
      {/* Navbar */}
      
      {/* Hero Section */}
  <section className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-16 bg-gradient-to-br from-white via-yellow-50 to-yellow-100 relative">
        {/* Left: Text */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex text-yellow-400">
              {[...Array(5)].map((_,i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
            </span>
            <span className="text-black font-semibold text-lg">4.8/5</span>
            <span className="text-black/70 text-base">Trusted by thousands of buyers & sellers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-black mb-4 leading-tight" style={{fontFamily: 'sans-serif'}}>
            <span className="bg-yellow-200 px-2 rounded">Your Marketplace,</span><br/>
            <span className="text-yellow-500">Your Opportunity</span><br/>
            <span className="text-2xl md:text-3xl font-semibold text-black block mt-2">Buy. Sell. Connect. All in one place.</span>
          </h1>
          <p className="text-black/80 text-xl mb-8">
            Buy and sell with ease. <span className="text-yellow-500 font-semibold">List your products</span> or discover great deals—everything in one marketplace.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="/login">
              <Button className="rounded-full bg-black text-yellow-400 px-8 py-3 text-lg font-semibold border-2 border-black hover:bg-yellow-400 hover:text-black">
              Start Shopping <span className="ml-2">→</span>
            </Button>
            </a>
           <a href="/login">
             <Button variant="outline" className="rounded-full border-2 border-black text-black px-8 py-3 text-lg font-semibold bg-white hover:bg-black hover:text-yellow-400">
              Sell Your Product <span className="ml-2">→</span>
            </Button>
           </a>
          </div>
        </div>
        {/* Right: Hero Image(s) */}
        <div className="flex-1 flex items-center justify-center mt-12 md:mt-0">
          {/* Example marketplace hero image, replace with your own */}
          <img src="/landing.avif" alt="Marketplace" className="w-[500px] h-[500px] object-contain drop-shadow-2xl" />
        </div>
        {/* Decorative yellow clouds (optional) */}
        <div className="absolute top-10 left-1/3 w-32 h-20 bg-yellow-200/80 rounded-full blur-2xl" style={{zIndex:0}}></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-24 bg-yellow-100/70 rounded-full blur-2xl" style={{zIndex:0}}></div>
      </section>
    </div>
  )
}
