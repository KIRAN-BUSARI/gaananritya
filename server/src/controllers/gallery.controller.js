import { Gallery } from "../models/gallery.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const uploadImg = asyncHandler(async (req, res) => {
  const localImg = req.file?.path
  if (!localImg) {
    throw new ApiError(400, "Please upload an image")
  }

  const result = await uploadOnCloudinary(localImg);

  const gallery = await Gallery.create({
    image: result.secure_url
  })
  res.json(new ApiResponse(200, "Gallery Image uploaded successfully", gallery))
});

const getImgs = asyncHandler(async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.json(new ApiResponse(200, "All Gallery Images", gallery))
  } catch (error) {
    throw new ApiError(400, "Error getting images")
  }
});

const deleteImg = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const gallery = await Gallery.findById(id);
  if (!gallery) {
    throw new ApiError(404, "Image not found")
  }
  await Gallery.findByIdAndDelete(id);
  res.json(new ApiResponse(200, "Image deleted successfully"))
});

export { uploadImg, getImgs, deleteImg }