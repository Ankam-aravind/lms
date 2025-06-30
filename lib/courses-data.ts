// Mock course data for static deployment
export interface Course {
  id: number
  title: string
  description: string
  trainer_id: number
  trainer_name: string
  batch_id: number
  batch_name: string
  is_published: boolean
  created_at: string
  duration_hours: number
  students_enrolled: number
  progress?: number
  thumbnail?: string
}

export interface Video {
  id: number
  course_id: number
  title: string
  description: string
  duration_seconds: number
  order_index: number
  created_at: string
  video_url?: string
  is_watched?: boolean
}

export interface Batch {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
}

// Mock data
export const mockCourses: Course[] = [
  {
    id: 1,
    title: "HTML & CSS Fundamentals",
    description:
      "Learn the basics of web development with HTML and CSS. Master semantic markup, responsive design, and modern CSS techniques.",
    trainer_id: 3,
    trainer_name: "Sarah Johnson",
    batch_id: 1,
    batch_name: "Web Development Batch 2024",
    is_published: true,
    created_at: "2024-01-15T10:00:00Z",
    duration_hours: 25,
    students_enrolled: 45,
    progress: 75,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "JavaScript Essentials",
    description:
      "Master JavaScript programming from basics to advanced concepts. Learn ES6+, DOM manipulation, and asynchronous programming.",
    trainer_id: 3,
    trainer_name: "Sarah Johnson",
    batch_id: 1,
    batch_name: "Web Development Batch 2024",
    is_published: true,
    created_at: "2024-01-20T10:00:00Z",
    duration_hours: 40,
    students_enrolled: 38,
    progress: 60,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "React.js Complete Guide",
    description:
      "Build modern web applications with React.js. Learn components, hooks, state management, and best practices.",
    trainer_id: 3,
    trainer_name: "Sarah Johnson",
    batch_id: 1,
    batch_name: "Web Development Batch 2024",
    is_published: true,
    created_at: "2024-02-01T10:00:00Z",
    duration_hours: 50,
    students_enrolled: 32,
    progress: 30,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Node.js Backend Development",
    description:
      "Create powerful backend applications with Node.js. Learn Express.js, databases, APIs, and deployment.",
    trainer_id: 4,
    trainer_name: "Mike Chen",
    batch_id: 2,
    batch_name: "Backend Development Batch 2024",
    is_published: true,
    created_at: "2024-02-10T10:00:00Z",
    duration_hours: 45,
    students_enrolled: 28,
    progress: 15,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Python for Data Science",
    description:
      "Analyze data and build machine learning models with Python. Learn pandas, numpy, matplotlib, and scikit-learn.",
    trainer_id: 5,
    trainer_name: "Dr. Emily Rodriguez",
    batch_id: 3,
    batch_name: "Data Science Batch 2024",
    is_published: true,
    created_at: "2024-02-15T10:00:00Z",
    duration_hours: 60,
    students_enrolled: 25,
    progress: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Mobile App Development with Flutter",
    description:
      "Build cross-platform mobile applications using Flutter and Dart. Learn widgets, state management, and deployment.",
    trainer_id: 6,
    trainer_name: "Alex Kumar",
    batch_id: 4,
    batch_name: "Mobile Development Batch 2024",
    is_published: true,
    created_at: "2024-02-20T10:00:00Z",
    duration_hours: 55,
    students_enrolled: 22,
    progress: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export const mockVideos: Video[] = [
  // HTML & CSS Fundamentals videos
  {
    id: 1,
    course_id: 1,
    title: "Introduction to HTML",
    description: "Learn the basics of HTML structure and semantic elements",
    duration_seconds: 1800,
    order_index: 1,
    created_at: "2024-01-15T10:00:00Z",
    is_watched: true,
  },
  {
    id: 2,
    course_id: 1,
    title: "CSS Fundamentals",
    description: "Understanding CSS selectors, properties, and the box model",
    duration_seconds: 2100,
    order_index: 2,
    created_at: "2024-01-15T11:00:00Z",
    is_watched: true,
  },
  {
    id: 3,
    course_id: 1,
    title: "Responsive Design with CSS Grid",
    description: "Creating responsive layouts using CSS Grid and Flexbox",
    duration_seconds: 2400,
    order_index: 3,
    created_at: "2024-01-15T12:00:00Z",
    is_watched: false,
  },
  // JavaScript Essentials videos
  {
    id: 4,
    course_id: 2,
    title: "JavaScript Basics",
    description: "Variables, data types, and basic operations in JavaScript",
    duration_seconds: 1950,
    order_index: 1,
    created_at: "2024-01-20T10:00:00Z",
    is_watched: true,
  },
  {
    id: 5,
    course_id: 2,
    title: "Functions and Scope",
    description: "Understanding functions, closures, and variable scope",
    duration_seconds: 2250,
    order_index: 2,
    created_at: "2024-01-20T11:00:00Z",
    is_watched: false,
  },
]

export const mockBatches: Batch[] = [
  {
    id: 1,
    name: "Web Development Batch 2024",
    description: "Complete web development program covering frontend and backend technologies",
    start_date: "2024-01-15T00:00:00Z",
    end_date: "2024-06-15T00:00:00Z",
    is_active: true,
  },
  {
    id: 2,
    name: "Backend Development Batch 2024",
    description: "Specialized backend development program focusing on server-side technologies",
    start_date: "2024-02-01T00:00:00Z",
    end_date: "2024-07-01T00:00:00Z",
    is_active: true,
  },
  {
    id: 3,
    name: "Data Science Batch 2024",
    description: "Comprehensive data science program with Python and machine learning",
    start_date: "2024-02-15T00:00:00Z",
    end_date: "2024-08-15T00:00:00Z",
    is_active: true,
  },
  {
    id: 4,
    name: "Mobile Development Batch 2024",
    description: "Mobile app development using modern frameworks and tools",
    start_date: "2024-03-01T00:00:00Z",
    end_date: "2024-09-01T00:00:00Z",
    is_active: true,
  },
]

// Helper functions
export function getCourses(): Course[] {
  return mockCourses.filter((course) => course.is_published)
}

export function getCourseById(id: number): Course | null {
  return mockCourses.find((course) => course.id === id) || null
}

export function getCoursesByTrainer(trainerId: number): Course[] {
  return mockCourses.filter((course) => course.trainer_id === trainerId && course.is_published)
}

export function getVideosByCourse(courseId: number): Video[] {
  return mockVideos.filter((video) => video.course_id === courseId)
}

export function getVideoById(id: number): Video | null {
  return mockVideos.find((video) => video.id === id) || null
}

export function getBatches(): Batch[] {
  return mockBatches.filter((batch) => batch.is_active)
}

export function getBatchById(id: number): Batch | null {
  return mockBatches.find((batch) => batch.id === id) || null
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function calculateCourseProgress(courseId: number): number {
  const videos = getVideosByCourse(courseId)
  if (videos.length === 0) return 0

  const watchedVideos = videos.filter((video) => video.is_watched).length
  return Math.round((watchedVideos / videos.length) * 100)
}
