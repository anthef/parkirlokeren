"use client";

import { useAuth } from "@/hooks/useAuth";
import { AceternitySidebar } from "@/components/aceternity-sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLoading from "./loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <DashboardLoading />;
  }

  // Extra check to ensure we don't render dashboard content for non-authenticated users
  if (!user) {
    return <DashboardLoading />; // Or null, since we're redirecting anyway
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex">
        <AceternitySidebar email={user.email ?? ""} />
        <main className="flex-1 p-6 overflow-auto relative -top-16 h-screen ">
          {children}
        </main>
      </div>
    </div>
  );
}
