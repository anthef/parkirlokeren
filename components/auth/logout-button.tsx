"use client";

import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const { handleAuthAction } = useAuth();

  const handleLogout = async () => {
    const result = await signOutAction();
    handleAuthAction(result);
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Sign out
    </Button>
  );
}
