import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LMSCloud - Learn with Expert-Led Video Courses",
  description:
    "Master new skills with our comprehensive video learning platform. Expert instructors, interactive courses, and certificates.",
  keywords: "online learning, video courses, education, training, certificates",
  authors: [{ name: "LMSCloud Team" }],
  creator: "LMSCloud",
  publisher: "LMSCloud",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lmscloud.vercel.app",
    title: "LMSCloud - Learn with Expert-Led Video Courses",
    description: "Master new skills with our comprehensive video learning platform.",
    siteName: "LMSCloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "LMSCloud - Learn with Expert-Led Video Courses",
    description: "Master new skills with our comprehensive video learning platform.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
