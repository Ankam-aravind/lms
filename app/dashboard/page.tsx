"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Clock, TrendingUp, Play, CheckCircle, LogOut, Settings, Bell } from "lucide-react"
import { getCurrentUser, logout, type User as AuthUser } from "@/lib/auth-client"
import { getCourses, getCoursesByTrainer, type Course } from "@/lib/courses-data"
import { useRouter } from "next/navigation"

function DashboardContent() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      // Load courses based on user role
      if (currentUser.role === "TRAINER") {
        setCourses(getCoursesByTrainer(currentUser.id))
      } else {
        setCourses(getCourses())
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800"
      case "TRAINER":
        return "bg-blue-100 text-blue-800"
      case "STUDENT":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getStats = () => {
    if (!user) return { totalCourses: 0, completedCourses: 0, totalHours: 0, avgProgress: 0 }

    const totalCourses = courses.length
    const completedCourses = courses.filter((c) => (c.progress || 0) >= 100).length
    const totalHours = courses.reduce((sum, c) => sum + c.duration_hours, 0)
    const avgProgress =
      totalCourses > 0 ? Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / totalCourses) : 0

    return { totalCourses, completedCourses, totalHours, avgProgress }
  }

  const stats = getStats()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">LMSCloud</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {user.full_name || user.email}!
              </h2>
              <p className="text-gray-600 mt-1">Welcome back to your learning dashboard</p>
            </div>
            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {user.role === "TRAINER" ? "Courses you teach" : "Available courses"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.role === "STUDENT" ? "Completed" : "Published"}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                {user.role === "STUDENT" ? "Courses completed" : "Published courses"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}h</div>
              <p className="text-xs text-muted-foreground">Total content duration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">Overall completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">{user.role === "TRAINER" ? "My Courses" : "Available Courses"}</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            {user.role === "ADMIN" && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg mb-4 flex items-center justify-center">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration_hours}h
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students_enrolled}
                        </span>
                      </div>

                      {user.role === "STUDENT" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress || 0}%</span>
                          </div>
                          <Progress value={course.progress || 0} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{course.batch_name}</Badge>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          {user.role === "TRAINER" ? "Manage" : "Continue"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {courses.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
                  <p className="text-gray-600">
                    {user.role === "TRAINER"
                      ? "You haven't created any courses yet."
                      : "No courses are currently available for your batch."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Track your progress across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{course.title}</h4>
                        <span className="text-sm text-gray-600">{course.progress || 0}%</span>
                      </div>
                      <Progress value={course.progress || 0} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{course.trainer_name}</span>
                        <span>{course.duration_hours}h total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {user.role === "ADMIN" && (
            <TabsContent value="admin" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Overview</CardTitle>
                    <CardDescription>Platform statistics and health</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Users</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Courses</span>
                        <span className="font-medium">{courses.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Status</span>
                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Bell className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Course Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
