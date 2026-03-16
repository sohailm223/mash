"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/commen/Button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the user cookie by setting its expiry date to the past
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to the login page and refresh to clear server-side cache
    router.push("/login");
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} className="bg-red-600">
      Logout
    </Button>
  );
}