// controllers/pdfController.js

import { uploadOnCloudinary } from "../config/cloudinary.js";
import fs from "fs";

const uploadPdf = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded"
      });
    }

    // Validate file type
    if (req.file.mimetype !== "application/pdf") {
      // Remove the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed"
      });
    }

    // Get the local file path
    const localFilePath = req.file.path;

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload PDF to Cloudinary"
      });
    }

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);

    // Send success response
    return res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      data: {
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        format: cloudinaryResponse.format,
        size: cloudinaryResponse.bytes
      }
    });

  } catch (error) {
    console.error("Error uploading PDF:", error);
    
    // Clean up local file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting local file:", unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export { uploadPdf };