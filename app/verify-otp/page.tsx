"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, ArrowLeft } from "lucide-react"
import { verifyOTP, sendOTP, getCurrentUser } from "@/lib/auth-client"
import Link from "next/link"

function VerifyOTPContent() {
  const [otpCode, setOtpCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resending, setResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/login")
    }
  }, [email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await verifyOTP(email, otpCode)

      if (!result.success) {
        setError(result.message || "OTP verification failed")
        return
      }

      setSuccess("Login successful! Redirecting to dashboard...")

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      console.error("OTP verification error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    setError("")
    setSuccess("")

    try {
      const result = await sendOTP(email)

      if (!result.success) {
        setError(result.message || "Failed to resend OTP")
        return
      }

      setSuccess(`New OTP sent! Code: ${result.otpCode}`)
    } catch (error) {
      console.error("Resend OTP error:", error)
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setResending(false)
    }
  }

  const formatOTP = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase()
    return cleaned.slice(0, 6)
  }

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatOTP(e.target.value)
    setOtpCode(formatted)
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify OTP</h1>
          <p className="text-gray-600 mt-2">Enter the code sent to your email</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              We've sent a 6-character code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="otpCode">Verification Code</Label>
                <Input
                  id="otpCode"
                  type="text"
                  placeholder="Enter 6-character code"
                  value={otpCode}
                  onChange={handleOTPChange}
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-widest"
                  required
                  disabled={loading}
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-gray-500 text-center">Code format: ABC123 (letters and numbers)</p>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1" disabled={loading || otpCode.length !== 6}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={handleResendOTP} disabled={resending || loading}>
                  {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resend"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  )
}
