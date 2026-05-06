import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["inter"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-900`}>
        <SessionProvider session={undefined}>{children}</SessionProvider>
      </body>
    </html>
  );
}