"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

// Define a consistent return type for auth actions
export type AuthActionResult = {
  success: boolean;
  message: string;
  redirectTo?: string;
  user?: any;
};

export const signUpAction = async (
  formData: FormData
): Promise<AuthActionResult> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
      redirectTo: "/signup",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      success: false,
      message: error.message,
      redirectTo: "/signup",
    };
  }

  return {
    success: true,
    message:
      "Thanks for signing up! Please check your email for a verification link.",
    redirectTo: "/login",
  };
};

export const signInAction = async (
  formData: FormData
): Promise<AuthActionResult> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      redirectTo: "/login",
    };
  }

  return {
    success: true,
    message: "Successfully logged in!",
    redirectTo: "/dashboard",
    user: data.user,
  };
};

export const signOutAction = async (): Promise<AuthActionResult> => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return {
    success: true,
    message: "You have been signed out",
    redirectTo: "/",
  };
};

export const forgotPasswordAction = async (
  formData: FormData
): Promise<AuthActionResult> => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return {
      success: false,
      message: "Email is required",
      redirectTo: "/forgot-password",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      success: false,
      message: error.message,
      redirectTo: "/forgot-password",
    };
  }

  return {
    success: true,
    message: "Password reset email sent! Please check your inbox for further instructions.",
    redirectTo: "/forgot-password",
  };
};

export const resetPasswordAction = async (
  formData: FormData
): Promise<AuthActionResult> => {
  const password = formData.get("password")?.toString();
  const supabase = await createClient();

  if (!password) {
    return {
      success: false,
      message: "Password is required",
      redirectTo: "/reset-password",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      success: false,
      message: error.message,
      redirectTo: "/reset-password",
    };
  }

  return {
    success: true,
    message: "Password updated successfully! You can now log in with your new password.",
    redirectTo: "/login",
  };
};

