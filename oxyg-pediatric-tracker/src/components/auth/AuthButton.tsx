import { LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthButton({ isAuthenticated, onLogin, onLogout }: { isAuthenticated: boolean; onLogin: () => void; onLogout: () => void }) {
  if (isAuthenticated) return <Button onClick={onLogout}><LogOut className="mr-2 inline size-4" />Logout</Button>
  return <Button onClick={onLogin}><LogIn className="mr-2 inline size-4" />Login</Button>
}
