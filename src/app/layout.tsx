import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { ThemeProvider } from "~/app/_components/providers/theme";
import { ThemeSwitcher } from "~/app/_components/theme-switcher";
import { Toaster } from "~/app/_components/ui/toaster";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import Navigation from "./_components/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Recipes",
  description: "Recipes for food ...what else",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <ClerkProvider>
        <body className={`font-sans ${inter.variable}`}>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <SignedIn>
                <div className="absolute right-0 m-3 flex">
                  <div className="mr-3">
                    <ThemeSwitcher />
                  </div>
                  <div className="flex flex-col justify-center">
                    <UserButton />
                  </div>
                </div>
              </SignedIn>
              <Navigation />
              {children}
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
