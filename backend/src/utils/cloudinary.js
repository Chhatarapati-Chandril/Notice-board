import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { devError, devLog } from "./logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    devLog("file is uploaded on cloudinary", response.public_id);
    devLog(response);

    return {
      url: response.secure_url,
      publicId: response.public_id,
      format: response.format,
      bytes: response.bytes,
      resourceType: response.resource_type,
    };
  } catch (error) {
    devError("Cloudinary upload failed:", error.message);
    return null;
  } finally {
    // ALWAYS clean up local file if it exists
    try {
      await fs.unlink(localFilePath);
    } catch (error) {
      devError("Failed to delete temp file:", error.message);
    }
  }
};
