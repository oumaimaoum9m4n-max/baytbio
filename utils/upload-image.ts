import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadImage = async (image: string, folder: string): Promise<string> => {
  const item = await cloudinary.uploader.upload(image, {
    folder: `bayt-bio/${folder}`,
  });
  return item.secure_url;
};

export default uploadImage;
