import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const validateAndFormatDate = (dateStr) => {
  // Try parsing as YYYY-MM-DD first
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try parsing DD/MM/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    date = new Date(`${year}-${month}-${day}`);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  throw new ApiError(400, "Invalid date format. Please use YYYY-MM-DD or DD/MM/YYYY format");
};

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

    // Validate and format the date
    const parsedDate = validateAndFormatDate(date);

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

    // Create updateFields object for provided fields
    const updateFields = {};

    // Only add fields that are actually provided (not undefined or null)
    if (title !== undefined && title !== null) {
      updateFields.title = title.trim();
    }
    if (content !== undefined && content !== null) {
      updateFields.content = content.trim();
    }
    if (author !== undefined && author !== null) {
      updateFields.author = author.trim();
    }

    // Parse and validate date only if provided
    if (date !== undefined && date !== null) {
      try {
        // Validate and format the date
        const parsedDate = validateAndFormatDate(date);
        // Set time to noon to avoid timezone issues
        parsedDate.setUTCHours(12, 0, 0, 0);
        updateFields.date = parsedDate;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError(400, "Invalid date format. Please use YYYY-MM-DD or DD/MM/YYYY format");
      }
    }

    // Handle image upload if provided
    if (imageLocalPath) {
      try {
        const uploadedImage = await uploadOnCloudinary(imageLocalPath);
        if (!uploadedImage?.url) {
          throw new ApiError(500, "Error uploading image to Cloudinary");
        }
        updateFields.image = uploadedImage.url;
      } catch (error) {
        throw new ApiError(500, "Failed to upload image");
      }
    }

    // Proceed with update even if no fields are provided (allowing partial updates)
    const blog = await Blog.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!blog) {
      throw new ApiError(400, "Failed to update blog");
    }

    return res.status(200).json(
      new ApiResponse(200, "Blog updated successfully", blog)
    );

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error?.message || "Error while updating blog");
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      throw new ApiError(404, "Blog not found")
    }
    res.status(200).json(
      new ApiResponse(200, "Blog deleted successfully", blog)
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error while deleting blog", error)
  }
});

export { createBlog, getBlogs, updateBlog, deleteBlog };