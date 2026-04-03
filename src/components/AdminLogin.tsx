import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, LogOut, Shield } from "lucide-react";

const STORAGE_KEY = "budget_admin_password";
const DEFAULT_PASSWORD = "admin123";

function getPassword() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_PASSWORD;
}

interface AdminLoginProps {
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AdminLogin({ isAdmin, onLogin, onLogout }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    if (password === getPassword()) {
      onLogin();
      setPassword("");
      setError("");
      setIsOpen(false);
    } else {
      setError("Incorrect password");
    }
  };

  if (isAdmin) {
    return (
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Admin Mode</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="gap-2 rounded-full"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-foreground w-full"
        >
          <Lock className="h-4 w-4 text-muted-foreground" />
          🔐 Admin login
          <svg
            className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="mt-4 flex gap-2 animate-fade-in"
          >
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="flex-1 rounded-xl"
            />
            <Button type="submit" className="rounded-xl">
              Login
            </Button>
          </form>
        )}
        {error && (
          <p className="text-destructive text-sm mt-2 animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
}
