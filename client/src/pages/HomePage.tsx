
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function HomePage() {
  return (
  <div className="min-h-screen bg-white flex flex-col">
      {/* Top Announcement Bar */}
      <div className="w-full bg-black text-yellow-400 text-center py-2 text-xs font-medium tracking-wide">
        HYDRATE* IS HERE. BE THE FIRST TO TRY IT!
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
            <span className="text-black/70 text-base">based on 9,161 reviews</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4 leading-tight" style={{fontFamily: 'sans-serif'}}>
            <span className="bg-yellow-200 px-2 rounded">Everything you need,</span><br/>
            <span className="">nothing you don't</span>
          </h1>
          <p className="text-black/80 text-xl mb-8">Feel your best with <span className="text-yellow-500 font-semibold">science-backed</span> supplements for your brain, body and gut.</p>
          <div className="flex gap-4">
            <Button className="rounded-full bg-black text-yellow-400 px-8 py-3 text-lg font-semibold border-2 border-black hover:bg-yellow-400 hover:text-black">SHOP ALL <span className="ml-2">→</span></Button>
            <Button variant="outline" className="rounded-full border-2 border-black text-black px-8 py-3 text-lg font-semibold bg-white hover:bg-black hover:text-yellow-400">BUNDLE & SAVE <span className="ml-2">→</span></Button>
          </div>
        </div>
        {/* Right: Hero Image(s) */}
        <div className="flex-1 flex items-center justify-center mt-12 md:mt-0">
          {/* Leave image src empty for now */}
          <img src="" alt="Hero Product" className="w-[350px] h-[350px] object-contain drop-shadow-2xl" />
        </div>
        {/* Decorative yellow clouds (optional) */}
        <div className="absolute top-10 left-1/3 w-32 h-20 bg-yellow-200/80 rounded-full blur-2xl" style={{zIndex:0}}></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-24 bg-yellow-100/70 rounded-full blur-2xl" style={{zIndex:0}}></div>
      </section>
    </div>
  )
}
