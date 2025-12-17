import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema({
  chapterName:{
    type: String, required: true,
  },
  about:{
    type: String, required: true,
  },
  duration:{
    type: String, required: true,
  }
})

const CourseSchema = new mongoose.Schema({
  courseId:{
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for this course.'],
  },
  description: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  chapters: [ChapterSchema],
  outline: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);