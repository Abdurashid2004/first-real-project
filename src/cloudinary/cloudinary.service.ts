import { Injectable } from "@nestjs/common";
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";
import toStream = require("buffer-to-stream");

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );

      toStream(file.buffer).pipe(uploadStream);
    });
  }

  async removeImage(
    publicId: string
  ): Promise<{ result: string } | UploadApiErrorResponse> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  extractPublicIdFromUrl(url: string): string {
    const parts = url.split("/");
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];
    return publicId;
  }

  async removeImageByUrl(
    url: string
  ): Promise<{ result: string } | UploadApiErrorResponse> {
    const publicId = this.extractPublicIdFromUrl(url);
    return this.removeImage(publicId);
  }
}
