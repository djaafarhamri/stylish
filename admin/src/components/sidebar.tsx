
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, Settings, LogOut, X } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { useAuth } from "../contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: ShoppingBag, label: "Products", href: "/products" },
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:relative md:z-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">FashionAdmin</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

