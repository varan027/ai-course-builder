export interface Chapter {
  index: string;
  chapterName: string;
  about: string;
  duration: string;
  videoId?: string;
  content?: string;
}

export interface CourseOutline {
  courseName: string;
  description: string;
  chapters: Chapter[];
}

export interface CourseData {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  topic: string;
  level: string;
  duration: string;
  style: string;
  chapters: Chapter[];
  outline: CourseOutline;
  createdAt: string | Date;
}

export interface FormValues {
  topic: string;
  description?: string | undefined;
  level: string;
  style: string;
  chapters: number;
  duration: number;
}
