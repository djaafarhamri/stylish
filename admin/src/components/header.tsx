
import { Menu, Bell, Sun, Moon } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface HeaderProps {
  onMenuButtonClick: () => void
}

export default function Header({ onMenuButtonClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-card border-border">
      <Button variant="ghost" size="icon" onClick={onMenuButtonClick} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden md:block">
        <h1 className="text-xl font-semibold">Stylish Admin</h1>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

