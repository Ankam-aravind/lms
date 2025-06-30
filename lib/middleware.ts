import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export interface JWTPayload {
  userId: number
  email: string
  role: "STUDENT" | "TRAINER" | "ADMIN"
  iat: number
  exp: number
}

// Middleware to verify JWT tokens
export function verifyJWTMiddleware(request: NextRequest): JWTPayload | null {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get("authorization")
    const cookieToken = request.cookies.get("session_token")?.value

    let token: string | null = null

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    } else if (cookieToken) {
      token = cookieToken
    }

    if (!token) {
      return null
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET not configured")
    }

    const decoded = jwt.verify(token, secret) as JWTPayload
    return decoded
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

// Create protected route wrapper
export function withAuth(handler: Function, allowedRoles?: string[]) {
  return async (request: NextRequest) => {
    const payload = verifyJWTMiddleware(request)

    if (!payload) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
    }
    // Add user info to request
    ;(request as any).user = payload

    return handler(request)
  }
}
