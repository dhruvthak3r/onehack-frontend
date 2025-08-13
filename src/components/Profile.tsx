import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth0();

  return (
    <div className="relative inline-block text-left">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 rounded-md bg-[hsl(var(--surface))] px-3 py-2 hover:bg-[hsl(var(--surface-hover))] transition"
      >
        <img
          src={user?.picture || "/profile.png"}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-[hsl(var(--foreground))] font-medium">
          {user?.name || "User"}
        </span>
        <ChevronDown className="w-4 h-4 text-[hsl(var(--foreground))]" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[hsl(var(--card))] shadow-lg z-50">
          <div className="flex items-center space-x-3 border-b border-[hsl(var(--border))] p-4">
            <img
              src={user?.picture || "/profile.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-[hsl(var(--foreground))] font-semibold text-sm">
                {user?.name || "User"}
              </p>
              <div className="mt-1 inline-block rounded bg-[hsl(var(--surface-hover))] px-2 py-1 text-xs text-[hsl(var(--foreground))]">
                <span className="font-medium">{user?.email || "No Email"}</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="flex w-full items-center px-4 py-3 text-sm text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
