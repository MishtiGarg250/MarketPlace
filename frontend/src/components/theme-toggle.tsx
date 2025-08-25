type Theme = "light" | "dark";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  let icon = <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 transition-all" />
  let nextTheme = "dark";
  if (mounted) {
    if (theme === "dark") {
      icon = <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 transition-all" />
      
      nextTheme = "light";
    } else {
      icon = <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400 transition-all" />
      nextTheme = "dark";
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-background border-border hover:bg-accent hover:text-accent-foreground dark:bg-background dark:border-border dark:hover:bg-accent dark:hover:text-accent-foreground transition-all"
  onClick={() => setTheme(nextTheme as Theme)}
      aria-label="Toggle theme"
    >
      {icon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}