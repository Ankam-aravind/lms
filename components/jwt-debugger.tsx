"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Copy, Check } from "lucide-react"

interface JWTDebuggerProps {
  token?: string
}

export function JWTDebugger({ token }: JWTDebuggerProps) {
  const [showToken, setShowToken] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>JWT Token Debugger</CardTitle>
          <CardDescription>No token available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const parts = token.split(".")
  const header = parts[0] ? JSON.parse(atob(parts[0])) : null
  const payload = parts[1] ? JSON.parse(atob(parts[1])) : null

  const copyToken = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isExpired = payload?.exp ? Date.now() / 1000 > payload.exp : false

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>JWT Token Debugger</CardTitle>
            <CardDescription>Decode and inspect your JWT token</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isExpired ? "destructive" : "success"}>{isExpired ? "Expired" : "Valid"}</Badge>
            <Button variant="outline" size="sm" onClick={() => setShowToken(!showToken)}>
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={copyToken}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Display */}
        <div>
          <h4 className="font-medium mb-2">Raw Token:</h4>
          <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">
            {showToken ? token : "•".repeat(50) + "..."}
          </div>
        </div>

        {/* Header */}
        {header && (
          <div>
            <h4 className="font-medium mb-2">Header:</h4>
            <pre className="bg-blue-50 p-3 rounded-lg text-sm overflow-x-auto">{JSON.stringify(header, null, 2)}</pre>
          </div>
        )}

        {/* Payload */}
        {payload && (
          <div>
            <h4 className="font-medium mb-2">Payload:</h4>
            <pre className="bg-green-50 p-3 rounded-lg text-sm overflow-x-auto">{JSON.stringify(payload, null, 2)}</pre>
          </div>
        )}

        {/* Token Info */}
        {payload && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Issued At:</span>
              <br />
              {payload.iat ? new Date(payload.iat * 1000).toLocaleString() : "N/A"}
            </div>
            <div>
              <span className="font-medium">Expires At:</span>
              <br />
              {payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "N/A"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
