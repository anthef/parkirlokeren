import type React from "react";
import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/hooks/useAuth";

const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontHeading = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "BSS Parking - Parkir Lo Keren",
  description:
    "Kelola Parkir dengan Teknologi Terdepan",
  generator: "v0.dev",
  icons: {
    icon: "new-logo-bss-parking-mobile.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
