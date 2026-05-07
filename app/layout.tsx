import type { Metadata } from "next"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { CartProvider } from "@/components/providers/CartProvider"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/toaster"
import { CartDrawer } from "@/components/common/CartDrawer"
import "./globals.css"

export const metadata: Metadata = {
  title: "KARTEL | Luxury Perfumes",
  description: "Discover an exquisite collection of luxury perfumes at KARTEL. From niche to iconic fragrances, find your signature scent.",
  keywords: "luxury perfume, niche perfume, designer fragrance, haut parfumerie, cologne, eau de parfum",
  authors: [{ name: "KARTEL" }],
  openGraph: {
    title: "KARTEL | Luxury Perfumes",
    description: "Discover an exquisite collection of luxury perfumes at KARTEL.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "KARTEL | Luxury Perfumes",
    description: "Discover an exquisite collection of luxury perfumes at KARTEL.",
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
    <html lang="en">
      <body className="min-h-screen bg-kartel-black text-white overflow-x-hidden">
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
      </body>
    </html>
  )
}
