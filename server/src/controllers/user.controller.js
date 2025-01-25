import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}


const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (
    [email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User with Email already exists");
  }

  const user = await User.create({
    username,
    email,
    password
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  console.log(email, process.env.ADMIN_EMAIL, password, process.env.ADMIN_PASSWORD);

  if ((email !== process.env.ADMIN_EMAIL) || (password !== process.env.ADMIN_PASSWORD)) {
    throw new ApiError(500, "Please provide a correct ADMIN credentials")
  };

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "User Not Found! with this Email");
  }

  const isCorrectPassword = await user.isPasswordCorrect(password)

  if (!isCorrectPassword) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  if (!loggedInUser) {
    throw new ApiError(500, "Error while getting user details");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    path: '/'
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
      )
    )
});


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1 // this removes the field from document
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    path: '/'
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(
      200,
      req?.user,
      "User fetched successfully"
    ))
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
});


const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUsers,
  changeCurrentPassword
};