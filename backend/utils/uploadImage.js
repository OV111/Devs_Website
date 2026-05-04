import cloudinary from "../config/cloudinary.js";

export const uploadImage = (file, folder = "general") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    file.pipe(stream);
  });
};
