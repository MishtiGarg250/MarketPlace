import "./index.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Signup from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Problems from "@/pages/Problems"
import DailyLogs from "@/pages/DailyLogs.tsx"

function ConditionalHeader() {
  const location = useLocation()
  const hideHeader = ["/", "/login", "/signup"].includes(location.pathname)

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-background via-accent/10 to-primary/10 dark:from-background dark:via-zinc-900/60 dark:to-primary/20 transition-colors duration-500">
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {!hideHeader && <Header />}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/dailylogs" element={<DailyLogs/>}/>
          
          </Routes>
        </main>
      </div>
    </div>
  )
}

const App = () => (
  <TooltipProvider>
    <ThemeProvider defaultTheme="dark" storageKey="leetcode-theme">
      <BrowserRouter>
        <ConditionalHeader />
      </BrowserRouter>
    </ThemeProvider>
  </TooltipProvider>
)

export default App