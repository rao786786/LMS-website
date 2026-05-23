const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' }
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Category is required']
    },
    price: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String,
      default: ''
    },
    lessons: [lessonSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
