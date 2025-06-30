// Client-side authentication utilities for static deployment
import Cookies from "js-cookie"

export interface User {
  id: number
  email: string
  role: "STUDENT" | "TRAINER" | "ADMIN"
  full_name: string | null
  is_active: boolean
  created_at: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Mock users for demo (in production, this would come from your backend API)
const mockUsers: User[] = [
  {
    id: 1,
    email: "student@example.com",
    role: "STUDENT",
    full_name: "Demo Student",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: "trainer@example.com",
    role: "TRAINER",
    full_name: "Demo Trainer",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    email: "admin@example.com",
    role: "ADMIN",
    full_name: "Demo Admin",
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

// Mock credentials for demo
const mockCredentials = [
  { email: "student@example.com", password: "password123" },
  { email: "trainer@example.com", password: "password123" },
  { email: "admin@example.com", password: "password123" },
]

// Generate a simple token for demo purposes
function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    timestamp: Date.now(),
  }
  return btoa(JSON.stringify(payload))
}

// Decode token
function decodeToken(token: string): any {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

// Generate OTP
export function generateOTP(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Authenticate user (step 1: email + password)
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Validate input
    if (!email || !password) {
      return { success: false, message: "Email and password are required" }
    }

    // Find user
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Check credentials
    const validCredential = mockCredentials.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
    )

    if (!validCredential) {
      return { success: false, message: "Invalid email or password" }
    }

    // Check if user is active
    if (!user.is_active) {
      return { success: false, message: "Account is deactivated. Please contact support." }
    }

    return {
      success: true,
      user,
      message: "Authentication successful. Please check your email for OTP.",
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "Authentication failed. Please try again." }
  }
}

// Send OTP (mock implementation)
export async function sendOTP(email: string): Promise<{ success: boolean; message: string; otpCode?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const otpCode = generateOTP()

    // Store OTP in localStorage for demo (in production, this would be handled server-side)
    const otpData = {
      code: otpCode,
      email: email.toLowerCase(),
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    }

    localStorage.setItem("demo_otp", JSON.stringify(otpData))

    console.log(`🔐 Demo OTP for ${email}: ${otpCode}`)

    return {
      success: true,
      message: "OTP sent successfully",
      otpCode, // Include OTP in response for demo purposes
    }
  } catch (error) {
    console.error("Send OTP error:", error)
    return { success: false, message: "Failed to send OTP. Please try again." }
  }
}

// Verify OTP and complete login
export async function verifyOTP(email: string, otpCode: string): Promise<AuthResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    // Get stored OTP
    const storedOTPData = localStorage.getItem("demo_otp")
    if (!storedOTPData) {
      return { success: false, message: "No OTP found. Please request a new one." }
    }

    const otpData = JSON.parse(storedOTPData)

    // Validate OTP
    if (otpData.email !== email.toLowerCase() || otpData.code !== otpCode.toUpperCase()) {
      return { success: false, message: "Invalid OTP code" }
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expires) {
      localStorage.removeItem("demo_otp")
      return { success: false, message: "OTP has expired. Please request a new one." }
    }

    // Find user
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Generate token
    const token = generateToken(user)

    // Store session
    Cookies.set("auth_token", token, { expires: 0.5 }) // 12 hours
    localStorage.setItem("user", JSON.stringify(user))

    // Clean up OTP
    localStorage.removeItem("demo_otp")

    return {
      success: true,
      user,
      token,
      message: "Login successful",
    }
  } catch (error) {
    console.error("Verify OTP error:", error)
    return { success: false, message: "OTP verification failed. Please try again." }
  }
}

// Get current user from session
export function getCurrentUser(): User | null {
  try {
    const token = Cookies.get("auth_token")
    const userStr = localStorage.getItem("user")

    if (!token || !userStr) {
      return null
    }

    const tokenData = decodeToken(token)
    if (!tokenData || Date.now() - tokenData.timestamp > 12 * 60 * 60 * 1000) {
      // Token expired
      logout()
      return null
    }

    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// Logout user
export function logout(): void {
  Cookies.remove("auth_token")
  localStorage.removeItem("user")
  localStorage.removeItem("demo_otp")
}

// Check user role
export function hasRole(user: User | null, roles: string[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

// Role hierarchy check
export function hasRoleOrHigher(user: User | null, minimumRole: "STUDENT" | "TRAINER" | "ADMIN"): boolean {
  if (!user) return false

  const roleHierarchy = {
    STUDENT: 1,
    TRAINER: 2,
    ADMIN: 3,
  }

  return roleHierarchy[user.role] >= roleHierarchy[minimumRole]
}
