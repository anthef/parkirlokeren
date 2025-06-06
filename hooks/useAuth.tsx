"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AuthActionResult } from "@/app/actions";

// Define user type based on what you need
type UserData = {
  id: string;
  email: string | null;
  user_metadata: any;
  app_metadata: any;
  // Add other fields you need
};

type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
  handleAuthAction: (result: AuthActionResult) => void;
  logout: () => Promise<void>;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: UserData | null;
}) {
  const [user, setUser] = useState<UserData | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    // Set initial state if not passed from server
    if (!initialUser) {
      const getUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user as UserData | null);
        setIsLoading(false);
      };

      getUser();
    }

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user as UserData | null);
      setIsLoading(false);
    });

    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [initialUser]);

  // Handle auth action results and navigation
  const handleAuthAction = (result: AuthActionResult) => {
    // Show toast notification
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    // Update user if provided
    if (result.user) {
      setUser(result.user as UserData);
    }

    // Navigate if a redirect URL is provided
    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    toast({
      title: "Success",
      description: "You have been logged out",
    });
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, handleAuthAction, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
