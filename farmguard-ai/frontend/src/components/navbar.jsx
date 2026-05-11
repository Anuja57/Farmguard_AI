import { Link, NavLink } from "react-router-dom";
import { LogOut, Sprout } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../context/auth-context";

const links = [
  ["/dashboard", "Dashboard"],
  ["/chat", "AI Assistant"],
  ["/disease", "Disease Scan"],
  ["/weather", "Weather"],
  ["/market", "Market"],
  ["/analytics", "Analytics"],
];

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-brand-100/70 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-500 p-2 text-white">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <div className="font-['Fraunces'] text-xl text-brand-900">FarmGuard AI</div>
            <div className="text-xs text-brand-700">Smart agriculture for every farmer</div>
          </div>
        </Link>
        <nav className="hidden gap-6 text-sm text-brand-800 md:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "font-semibold text-brand-950" : "hover:text-brand-950")}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden text-right text-sm text-brand-800 md:block">
                <div className="font-semibold text-brand-950">{user?.name || "Farmer"}</div>
                <div>{user?.location || "Field user"}</div>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard">Open Platform</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
