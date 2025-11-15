import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Middleware for single file upload
export const uploadSingle = (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const uploadMiddleware = upload.single(fieldName);
        
        uploadMiddleware(req, res, (error: any) => {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    res.status(400).json({
                        success: false,
                        message: 'Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.'
                    });
                    return;
                }
                res.status(400).json({
                    success: false,
                    message: 'Lỗi upload file: ' + error.message
                });
                return;
            } else if (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
                return;
            }
            next();
        });
    };
};

// Middleware for multiple file upload
export const uploadMultiple = (fieldName: string, maxCount: number = 10) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const uploadMiddleware = upload.array(fieldName, maxCount);
        
        uploadMiddleware(req, res, (error: any) => {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    res.status(400).json({
                        success: false,
                        message: 'Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.'
                    });
                    return;
                }
                if (error.code === 'LIMIT_FILE_COUNT') {
                    res.status(400).json({
                        success: false,
                        message: `Số lượng file vượt quá giới hạn ${maxCount} files.`
                    });
                    return;
                }
                res.status(400).json({
                    success: false,
                    message: 'Lỗi upload file: ' + error.message
                });
                return;
            } else if (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
                return;
            }
            next();
        });
    };
};