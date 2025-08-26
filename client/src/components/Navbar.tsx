import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get user from localStorage
  let user = null
  let isAuthenticated = false
  try {
    const raw = localStorage.getItem("auth")
    if (raw) {
      const parsed = JSON.parse(raw)
      user = parsed.user
      isAuthenticated = !!parsed.token
    }
  } catch(err){
    console.log(err);
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", id: "dashboard" },
    { name: "Problems", href: "/problems", id: "problems" },
    {name: "Daily Logs", href:"/dailylogs", id:"dailylogs"}
  ]

  const getActiveItem = () => {
    const path = location.pathname
    if (path.includes("/dashboard")) return "dashboard"
    if (path.includes("/problems")) return "problems"
    if(path.includes("/dailylogs")) return "dailylogs"
    return ""
  }

  const activeItem = getActiveItem()

  const handleSignOut = () => {
    localStorage.removeItem("auth");
    navigate("/login")
  }

  return (
  <div className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-2xl backdrop-blur-sm transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
              <div className="hidden sm:block">
                <span className="font-mono text-[16px] tracking-tight group-hover:scale-105 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-primary to-primary text-transparent bg-clip-text group-hover:from-primary/80 group-hover:to-secondary/80 transition-all duration-300 font-bold">
                    CODE
                  </span>
                  <span className="text-foreground group-hover:text-foreground/80 transition-colors duration-300 font-bold">
                    {" "}
                    PERFECT
                  </span>
                </span>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`relative px-5 py-2 rounded-full mr-3 text-sm font-medium transition-all duration-300 ease-out transform hover:scale-105 ${
                    activeItem === item.id
                      ? "text-primary bg-accent/80 border border-primary shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30 border border-transparent"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {activeItem === item.id && (
                    <div className="absolute inset-0 bg-accent/40 rounded-full animate-pulse opacity-75"></div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-accent/10 transition-all duration-300"></div>
                </Link>
              ))}
            </div>

           

            {/* User Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex gap-2 items-center">
                <span className="font-semibold text-primary px-2">{user?.name || user?.email || "User"}</span>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="border-2 border-primary text-primary bg-card hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:bg-card dark:hover:bg-primary dark:hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 rounded-full px-6"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="border-2 border-primary text-primary bg-card hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:bg-card dark:hover:bg-primary dark:hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 rounded-full px-6"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg rounded-full px-6"
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:lg:hidden text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full p-2 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 transform rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-teal-500/20 py-6 space-y-4 animate-in slide-in-from-top duration-300">
            {/* Mobile Navigation */}
            <div className="space-y-2 px-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                  }}
                  className={`block rounded-xl p-4 mb-5 text-base font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    activeItem === item.id
                      ? "text-primary-foreground bg-accent/40 border border-primary/30 shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {activeItem === item.id && (
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            {isAuthenticated ? (
              <div className="px-4 pt-4 border-t border-teal-500/20 flex flex-col gap-2">
                <span className="font-semibold text-primary px-2">{user?.name || user?.email || "User"}</span>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full border-2 border-primary text-primary bg-card hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:bg-card dark:hover:bg-primary dark:hover:text-primary-foreground transition-all duration-300 rounded-full py-3"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="px-4 flex flex-row gap-3 pt-4 border-t border-teal-500/20">
                <div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login")
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full border-2 border-primary text-primary bg-card hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:bg-card dark:hover:bg-primary dark:hover:text-primary-foreground transition-all duration-300 rounded-full py-3"
                  >
                    Login
                  </Button>
                </div>
                <div className="flex-1">
                  <Button
                    onClick={() => {
                      navigate("/signup")
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg rounded-full py-3"
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}