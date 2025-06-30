"use client"

// API client with JWT token handling
class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL = "/api") {
    this.baseURL = baseURL
    this.loadTokenFromStorage()
  }

  // Load token from localStorage or cookies
  private loadTokenFromStorage() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  // Set token (called after successful login)
  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  // Clear token (called on logout)
  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  // Make authenticated API request
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Add JWT token to Authorization header
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      // Handle token expiration
      if (response.status === 401 && data.message?.includes("token")) {
        this.clearToken()
        window.location.href = "/login"
        return null
      }

      return { response, data }
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Convenience methods
  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" })
  }

  async post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  async put(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" })
  }
}

// Export singleton instance
export const apiClient = new APIClient()

// React hook for API calls
import { useState, useEffect } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const result = await apiClient.get("/user/profile")
      if (result?.data.success) {
        setUser(result.data.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const result = await apiClient.post("/auth/login", { email, password })
    return result?.data
  }

  const logout = () => {
    apiClient.clearToken()
    setUser(null)
    window.location.href = "/login"
  }

  return { user, loading, login, logout, checkAuthStatus }
}
