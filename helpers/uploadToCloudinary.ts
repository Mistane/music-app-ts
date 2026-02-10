import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { Express, Request, Response, NextFunction } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadSingle = (file: Express.Multer.File) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (err, result) => {
        if (result) {
          resolve(result);
        } else reject(err);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const uploadSingleCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file) {
    const result = await uploadSingle(req.file);
    req.body[req.file.fieldname] = result.secure_url;
  }
  next();
};

const uploadManyCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.files) {
    const files = [];
    const fileKeys = Object.keys(req.files);

    fileKeys.forEach(function (key) {
      files.push(...req.files[key]);
    });

    for (const file of files) {
      const result = await uploadSingle(file);
      console.log(file);
      console.log(result.secure_url);
      req.body[file.fieldname] = result.secure_url;
    }
    // Object.keys(req.files).forEach(async (key) => {
    //   console.log(req.files[key][0]);
    //   const result = await uploadSingle(req.files[key][0]);
    //   req.body[req.files[key][0]["fieldname"]] = result.secure_url;
    // });
  }
  next();
};
const cloudinaryHelper = {
  uploadSingle: uploadSingleCloudinary,
  uploadMany: uploadManyCloudinary,
};

export default cloudinaryHelper;
