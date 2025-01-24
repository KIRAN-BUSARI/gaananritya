import mongoose, { Schema } from 'mongoose';

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Blog = mongoose.model('Blog', blogSchema);