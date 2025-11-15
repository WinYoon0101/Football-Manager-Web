import cloudinary from '../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

class CloudinaryService {
  /**
   * Upload image to Cloudinary
   * @param fileBuffer - File buffer from multer
   * @param folder - Folder name in Cloudinary (optional)
   * @returns Promise with upload result containing secure_url
   */
  async uploadImage(
    fileBuffer: Buffer,
    folder: string = 'teams'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload image to Cloudinary'));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Unknown error uploading to Cloudinary'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Delete image from Cloudinary
   * @param imageUrl - Full URL or public_id of the image
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from URL
      const publicId = this.extractPublicId(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Extract public_id from Cloudinary URL
   */
  private extractPublicId(url: string): string | null {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
      // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/teams/team1.jpg
      const urlPattern = /\/upload\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)/i;
      const matches = url.match(urlPattern);
      
      if (matches && matches[1]) {
        // Remove any transformation parameters if present
        let publicId = matches[1];
        // Handle case where there might be transformations in the URL
        if (publicId.includes('/')) {
          // Split by '/' and take the last part if it's a transformation
          const parts = publicId.split('/');
          // If the last part looks like a transformation (e.g., w_800,h_800), skip it
          if (parts.length > 1 && /^[a-z_0-9]+$/.test(parts[parts.length - 1])) {
            publicId = parts.slice(0, -1).join('/');
          }
        }
        return publicId;
      }
      return null;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  }
}

export default new CloudinaryService();

