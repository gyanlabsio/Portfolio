const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');

// Multer storage — temp local upload before Cloudinary
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const allowedDocTypes = ['application/pdf'];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedDocTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpeg, png, webp, svg) and PDF documents are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Helper to determine fileType Enum based on mimetype
const determineFileType = (mimetype) => {
    if (mimetype.startsWith('image/')) return 'IMAGE';
    if (mimetype === 'application/pdf') return 'PDF';
    return 'OTHER';
};

// @desc    Upload single file
// @route   POST /api/upload
const uploadSingle = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const targetModule = req.body.module;
        if (!targetModule) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: 'Module category is required' });
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ success: false, message: 'Cloudinary not configured' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `portfolio/${targetModule.toLowerCase()}`,
            resource_type: determineFileType(req.file.mimetype) === 'IMAGE' ? 'image' : 'raw',
        });

        // Remove temp file
        fs.unlinkSync(req.file.path);

        // Save to DB
        const fileRecord = await File.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
            fileType: determineFileType(req.file.mimetype),
            module: targetModule,
            folder: req.body.folder || 'root'
        });

        res.status(201).json({
            success: true,
            data: {
                id: fileRecord._id,
                url: fileRecord.url,
                publicId: fileRecord.publicId,
                fileType: fileRecord.fileType,
            },
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(error);
    }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
const uploadMultiple = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const targetModule = req.body.module;
        if (!targetModule) {
            req.files.forEach(file => fs.unlinkSync(file.path));
            return res.status(400).json({ success: false, message: 'Module category is required' });
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            req.files.forEach(file => fs.unlinkSync(file.path));
            return res.status(500).json({ success: false, message: 'Cloudinary not configured' });
        }

        const uploadPromises = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: `portfolio/${targetModule.toLowerCase()}`,
                resource_type: determineFileType(file.mimetype) === 'IMAGE' ? 'image' : 'raw',
            });
            fs.unlinkSync(file.path);

            const fileRecord = await File.create({
                filename: file.filename,
                originalName: file.originalname,
                url: result.secure_url,
                publicId: result.public_id,
                fileType: determineFileType(file.mimetype),
                module: targetModule,
                folder: req.body.folder || 'root'
            });
            return fileRecord;
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        const mappedFiles = uploadedFiles.map(f => ({
            id: f._id,
            url: f.url,
            publicId: f.publicId,
            fileType: f.fileType,
        }));

        res.status(201).json({ success: true, data: mappedFiles });
    } catch (error) {
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
        next(error);
    }
};

// @desc    Delete a file
// @route   DELETE /api/upload/:id
const deleteFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found in database' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.publicId, {
            resource_type: file.fileType === 'IMAGE' ? 'image' : 'raw',
        });

        // Delete from database
        await file.deleteOne();

        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all files (admin)
// @route   GET /api/upload
const getAllFiles = async (req, res, next) => {
    try {
        const { module: targetModule, search, page = 1, limit = 20 } = req.query;
        const query = {};

        if (targetModule) {
            query.module = targetModule;
        }

        if (search) {
            query.originalName = { $regex: search, $options: 'i' };
        }

        const skip = (page - 1) * limit;
        const total = await File.countDocuments(query);
        const files = await File.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: files
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk delete files
// @route   POST /api/upload/bulk-delete
const bulkDelete = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No file IDs provided' });
        }

        const files = await File.find({ _id: { $in: ids } });
        
        for (const file of files) {
            try {
                await cloudinary.uploader.destroy(file.publicId, {
                    resource_type: file.fileType === 'IMAGE' ? 'image' : 'raw',
                });
            } catch (cloudErr) {
                console.error(`Failed to delete ${file.publicId} from Cloudinary:`, cloudErr);
            }
        }
        
        // Hard delete from DB
        await File.deleteMany({ _id: { $in: ids } });

        res.json({ success: true, message: `Successfully deleted ${files.length} files` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple,
    deleteFile,
    getAllFiles,
    bulkDelete
};
