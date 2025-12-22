import {v2 as cloudinary} from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (input) => {
    try {
        if (!input) {
            console.log("No file provided");
            return null;
        }

        // If caller passed a Buffer, upload via upload_stream
        if (Buffer.isBuffer(input)) {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'raw', type: 'upload' }, (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload_stream error:', error);
                        return reject(error);
                    }
                    console.log('File uploaded successfully to Cloudinary (stream)');
                    resolve(result);
                });

                streamifier.createReadStream(input).pipe(uploadStream);
            });
        }

        // Assume input is a path or URL
        console.log('Uploading to Cloudinary:', input);
        const response = await cloudinary.uploader.upload(input, { resource_type: 'raw', type: 'upload' });
        console.log('File uploaded successfully to Cloudinary:', response.url);
        return response;
    } catch (error) {
        console.error('Cloudinary upload error:', error && error.message ? error.message : error);
        return null;
    }
};

export { uploadOnCloudinary };