"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile, logout } from "./api";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // always run hooks, decide visibility afterwards
  const showNavbar = pathname !== "/login" && pathname !== "/register";

  useEffect(() => {
    async function load() {
      try {
        const res = await getProfile();
        if (res.success) setUser(res.data);
        else setUser(null);
      } catch (e) {
        // not logged in
        setUser(null);
      }
    }
    load();
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  const toggleMenu = () => setMenuOpen((o) => !o);

  // close menu when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest(".navbar-menu")) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  if (!showNavbar) return null;

  return (
    <nav className="p-4 bg-gray-100 flex justify-between items-center">
      <Link href="/" className="font-bold">
        MealMind
      </Link>
      <div className="relative">
        {user ? (
          <>
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white uppercase">
                {user.name ? user.name[0] : user.email[0]}
              </div>
            </button>
            {menuOpen && (
              <div className="navbar-menu absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                <div className="px-4 py-2">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="border-t">
                  <Link
                    href="/user-profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-x-4">
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}