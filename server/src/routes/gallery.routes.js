import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteImg, getImgs, uploadImg } from "../controllers/gallery.controller.js";
import { allowedRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(verifyJWT, allowedRoles("ADMIN"), upload.single('image'), uploadImg);

router.route("/all").get(getImgs);

router.route("/delete/:id").delete(verifyJWT, allowedRoles("ADMIN"), deleteImg);

export default router;