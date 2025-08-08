import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeProvider"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { setTheme, actualTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(actualTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="theme-toggle relative p-2 hover:bg-accent hover:text-accent-foreground focus-ring"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {actualTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
