# ARCHITECTURE.md

# Syllarc Architecture

---

# Authentication

Route:

app/(marketing)

Actions:

actions/auth.ts

Services:

services/auth.service.ts

Database:

User

---

# Course Generation

Route:

app/(dashboard)/create-course

Action:

actions/createCourse.ts

Services:

services/ai.service.ts

services/course.service.ts

Flow:

Form
↓
createCourse()
↓
courseService.create()
↓
aiService.generateCourseOutline()
↓
Gemini
↓
JSON Outline
↓
Database

---

# Progress Tracking

Action:

actions/toggleProgress.ts

Service:

services/progress.service.ts

Database:

ChapterProgress

---

# Resource Discovery

Service:

services/youtube.service.ts

Purpose:

Attach learning videos to generated chapters.

---

# Database Structure

User
↓
Course
↓
ChapterProgress

---

# Current Learning Model

Course
↓
Chapter
↓
Video
↓
Complete

---

# Future Learning Model

Goal
↓
Skill
↓
Resource
↓
Project
↓
Skill Journey

---

# Critical Files

actions/createCourse.ts

services/ai.service.ts

services/course.service.ts

services/progress.service.ts

services/youtube.service.ts

prisma/schema.prisma

These files should be understood before major feature development.
