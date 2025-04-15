export interface GolfCourse {
  id: string;
  name: string;
  city: string;
  country: string;
  par: number;
  slope?: number;
  courseRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Mock data for demonstration
const mockCourses: GolfCourse[] = [
  {
    id: "1",
    name: "Augusta National Golf Club",
    city: "Augusta",
    country: "USA",
    par: 72,
    slope: 148,
    courseRating: 75.2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "St Andrews Links (Old Course)",
    city: "St Andrews",
    country: "Scotland",
    par: 72,
    slope: 132,
    courseRating: 73.1,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Pebble Beach Golf Links",
    city: "Pebble Beach",
    country: "USA",
    par: 72,
    slope: 143,
    courseRating: 74.7,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

/**
 * Fetch golf courses based on search query
 * @param query Search query (name, city, country)
 * @returns Promise resolving to array of GolfCourse objects
 */
export const fetchGolfCourses = async (
  query: string = ""
): Promise<GolfCourse[]> => {
  // Simulated API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!query) return mockCourses;

  // Filter based on query
  return mockCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(query.toLowerCase()) ||
      course.city.toLowerCase().includes(query.toLowerCase()) ||
      course.country.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Fetch a golf course by ID
 * @param id Course ID
 * @returns Promise resolving to GolfCourse object or null if not found
 */
export const fetchGolfCourseById = async (
  id: string
): Promise<GolfCourse | null> => {
  // Simulated API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const course = mockCourses.find((c) => c.id === id);
  return course || null;
};

/**
 * Create a new golf course
 * @param courseData Golf course data without ID
 * @returns Promise resolving to created GolfCourse with ID
 */
export const createGolfCourse = async (
  courseData: Omit<GolfCourse, "id" | "createdAt" | "updatedAt">
): Promise<GolfCourse> => {
  // Simulated API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real implementation, this would be handled by the backend
  const newId = `course-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const newCourse: GolfCourse = {
    ...courseData,
    id: newId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // In a real implementation, you would add this to a database
  // Here we'll just pretend it was saved
  console.log("Created new course:", newCourse);

  return newCourse;
};

/**
 * Update an existing golf course
 * @param id Course ID
 * @param courseData Updated golf course data
 * @returns Promise resolving to updated GolfCourse
 */
export const updateGolfCourse = async (
  id: string,
  courseData: Partial<GolfCourse>
): Promise<GolfCourse> => {
  // Simulated API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find the course to update
  const existingCourseIndex = mockCourses.findIndex((c) => c.id === id);

  if (existingCourseIndex === -1) {
    throw new Error(`Course with ID ${id} not found`);
  }

  const updatedCourse: GolfCourse = {
    ...mockCourses[existingCourseIndex],
    ...courseData,
    updatedAt: new Date().toISOString(),
  };

  // In a real implementation, you would update this in a database
  console.log("Updated course:", updatedCourse);

  return updatedCourse;
};

/**
 * Delete a golf course
 * @param id Course ID
 * @returns Promise resolving to success message
 */
export const deleteGolfCourse = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  // Simulated API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find the course to delete
  const courseIndex = mockCourses.findIndex((c) => c.id === id);

  if (courseIndex === -1) {
    throw new Error(`Course with ID ${id} not found`);
  }

  // In a real implementation, you would delete this from a database
  console.log(`Deleted course with ID ${id}`);

  return {
    success: true,
    message: "Course deleted successfully",
  };
};
