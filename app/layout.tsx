import type { Metadata } from "next"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { CartProvider } from "@/components/providers/CartProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/toaster"
import { CartDrawer } from "@/components/common/CartDrawer"
import "./globals.css"

export const metadata: Metadata = {
  title: "CARL JONES | Luxury Perfumes",
  description: "Discover an exquisite collection of luxury perfumes at Carl Jones. From niche to iconic fragrances, find your signature scent.",
  keywords: "luxury perfume, niche perfume, designer fragrance, haut parfumerie, cologne, eau de parfum",
  authors: [{ name: "Carl Jones" }],
  openGraph: {
    title: "CARL JONES | Luxury Perfumes",
    description: "Discover an exquisite collection of luxury perfumes at Carl Jones.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CARL JONES | Luxury Perfumes",
    description: "Discover an exquisite collection of luxury perfumes at Carl Jones.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
