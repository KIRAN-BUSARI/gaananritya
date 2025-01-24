import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createBlog = asyncHandler(async (req, res) => {
  try {
    console.log("Creating blog - Request received");
    console.log("Request body:", req.body);
    console.log("File details:", req.file);

    const { title, date, content, author } = req.body;

    // Validate required fields
    if (!title?.trim() || !date?.trim() || !content?.trim() || !author?.trim()) {
      throw new ApiError(400, "All fields are required");
    }

    // Validate and parse date format (YYYY-MM-DD)
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD");
    }

    const imageLocalPath = req.file?.path;
    console.log("Image local path:", imageLocalPath);

    if (!imageLocalPath) {
      throw new ApiError(400, "Image file is required");
    }

    // Upload image to Cloudinary
    console.log("Uploading to Cloudinary...");
    const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);
    console.log("Cloudinary response:", cloudinaryResponse);

    if (!cloudinaryResponse?.url) {
      throw new ApiError(500, "Error uploading image to Cloudinary");
    }

    console.log("Cloudinary upload successful:", cloudinaryResponse.url);

    // Create blog post
    const blogData = {
      title,
      date: parsedDate,
      content,
      author,
      image: cloudinaryResponse.secure_url
    };

    const blog = await Blog.create(blogData);

    if (!blog) {
      throw new ApiError(500, "Failed to create blog in database");
    }

    console.log("Blog created successfully:", blog._id);

    return res
      .status(201)
      .json(new ApiResponse(
        201,
        "Blog created successfully",
        blog
      ));

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error?.message || "Error while creating blog");
  }
});

const getBlogs = asyncHandler(async (_, res) => {
  try {
    const blogs = await Blog.find();
    return res.json(
      new ApiResponse(200, "Blogs fetched successfully", blogs)
    )
  } catch (error) {
    throw new ApiError(500, "Something went wrong", error)
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, content, author } = req.body;
  const imageLocalPath = req.file?.path;

  try {
    // Check if blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      throw new ApiError(404, "Blog not found");
    }

    // Create updateFields object with only the provided fields
    const updateFields = {};

    if (title?.trim()) updateFields.title = title.trim();
    if (content?.trim()) updateFields.content = content.trim();
    if (author?.trim()) updateFields.author = author.trim();

    // Parse and validate date only if provided
    if (date?.trim()) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD");
      }
      updateFields.date = parsedDate;
    }

    // Handle image upload if provided
    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      if (!uploadedImage?.url) {
        throw new ApiError(500, "Error uploading image to Cloudinary");
      }
      updateFields.image = uploadedImage.url;
    }

    // Only update if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      throw new ApiError(400, "No fields provided for update");
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!blog) {
      throw new ApiError(400, "Failed to update blog")
    }
    return res.status(202).json(new ApiResponse(200, "Blog updated successfully", blog))
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error?.message || "Error while updating blog");
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      throw new ApiError(404, "Blog not found")
    }
    return new ApiResponse(200, "Blog deleted successfully", blog);
  } catch (error) {
    throw new ApiError(500, "Something went wrong", error)
  }
});

export { createBlog, getBlogs, updateBlog, deleteBlog };