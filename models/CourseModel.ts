import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  id:{
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for this course.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: true,
  },
  // You can store the JSON output from Gemini here
  outline: {
    type: Object, // Stores the complex JSON structure
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);