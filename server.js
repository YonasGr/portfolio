const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Block access to sensitive files
app.use((req, res, next) => {
    const blockedFiles = [
        '/server.js', '/package.json', '/package-lock.json', 
        '/.env', '/.env.example', '/.gitignore'
    ];
    
    if (blockedFiles.includes(req.path)) {
        return res.status(403).send('Access denied');
    }
    next();
});

// Serve static files from the current directory, with security considerations
// Note: This serves the root directory since the site structure has files at root.
// The .gitignore ensures node_modules, .env, and uploads are not exposed.
// For production, consider reorganizing files into a 'public' directory.
app.use(express.static(__dirname, {
    dotfiles: 'deny', // Deny access to dotfiles like .env
    index: 'index.html'
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept common document and media types
        const allowedMimes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'application/zip',
            'application/x-rar-compressed',
            'video/mp4', 'video/mpeg', 'video/quicktime',
            'audio/mpeg', 'audio/wav', 'audio/ogg'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported. Please upload images, documents, or common media files.'));
        }
    }
});

// Sanitize user input
function sanitizeInput(text) {
    if (!text) return '';
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Helper function to send text message to Telegram
async function sendTelegramTextMessage(chatId, text) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        })
    });
    
    return response.json();
}

// Helper function to send file to Telegram
async function sendTelegramFile(chatId, file, caption, isImage) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const endpoint = isImage ? 'sendPhoto' : 'sendDocument';
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`;
    
    // Validate file path is within uploads directory (prevent directory traversal)
    const resolvedPath = path.resolve(file.path);
    const resolvedUploadsPath = path.resolve(uploadsDir);
    
    // Ensure consistent path separator handling across platforms
    const normalizedResolvedPath = resolvedPath + path.sep;
    const normalizedUploadsPath = resolvedUploadsPath.endsWith(path.sep) 
        ? resolvedUploadsPath 
        : resolvedUploadsPath + path.sep;
    
    if (!normalizedResolvedPath.startsWith(normalizedUploadsPath)) {
        throw new Error('Invalid file path');
    }
    
    const form = new FormData();
    form.append('chat_id', chatId);
    
    const fieldName = isImage ? 'photo' : 'document';
    form.append(fieldName, fs.createReadStream(file.path), {
        filename: file.originalname
    });
    
    if (caption) {
        form.append('caption', caption);
    }
    
    const response = await fetch(url, {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
    });
    
    return response.json();
}

// Remove temporary file with path validation
function removeFile(filePath) {
    // Ensure file is within uploads directory for security (prevent directory traversal)
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsPath = path.resolve(uploadsDir);
    
    // Ensure consistent path separator handling across platforms
    const normalizedResolvedPath = resolvedPath + path.sep;
    const normalizedUploadsPath = resolvedUploadsPath.endsWith(path.sep) 
        ? resolvedUploadsPath 
        : resolvedUploadsPath + path.sep;
    
    if (!normalizedResolvedPath.startsWith(normalizedUploadsPath)) {
        console.error('Attempted to remove file outside uploads directory:', filePath);
        return;
    }
    
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error removing file:', err);
        });
    }
}

// Existing endpoint: POST /send-message (JSON)
app.post('/send-message', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required.'
            });
        }
        
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        
        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('Missing Telegram credentials');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. Please contact administrator.'
            });
        }
        
        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedMessage = sanitizeInput(message);
        
        const text = `<b>New Contact Form Message</b>\n\n` +
                     `<b>Name:</b> ${sanitizedName}\n` +
                     `<b>Email:</b> ${sanitizedEmail}\n` +
                     `<b>Message:</b>\n${sanitizedMessage}`;
        
        const result = await sendTelegramTextMessage(CHAT_ID, text);
        
        if (result.ok) {
            res.json({
                success: true,
                message: 'Message sent successfully!'
            });
        } else {
            console.error('Telegram API error:', result);
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again.'
            });
        }
    } catch (error) {
        console.error('Error in /send-message:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message.'
        });
    }
});

// New endpoint: POST /send-file (multipart/form-data)
app.post('/send-file', upload.single('file'), async (req, res) => {
    let filePath = null;
    
    try {
        const { name, email, explanation } = req.body;
        const file = req.file;
        
        if (!name || !email) {
            if (file) removeFile(file.path);
            return res.status(400).json({
                success: false,
                message: 'Name and email are required.'
            });
        }
        
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        
        if (!BOT_TOKEN || !CHAT_ID) {
            if (file) removeFile(file.path);
            console.error('Missing Telegram credentials');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. Please contact administrator.'
            });
        }
        
        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedExplanation = sanitizeInput(explanation);
        
        if (file) {
            filePath = file.path;
            
            // Build caption
            let caption = `<b>New File Upload</b>\n\n` +
                         `<b>Name:</b> ${sanitizedName}\n` +
                         `<b>Email:</b> ${sanitizedEmail}`;
            
            if (sanitizedExplanation) {
                caption += `\n<b>Explanation:</b>\n${sanitizedExplanation}`;
            }
            
            // Determine if file is an image
            const isImage = file.mimetype.startsWith('image/');
            
            // Send file to Telegram
            const result = await sendTelegramFile(CHAT_ID, file, caption, isImage);
            
            // Remove temporary file
            removeFile(filePath);
            
            if (result.ok) {
                res.json({
                    success: true,
                    message: 'File and information sent successfully!'
                });
            } else {
                console.error('Telegram API error:', result);
                res.status(500).json({
                    success: false,
                    message: 'Failed to send file. Please try again.'
                });
            }
        } else {
            // No file uploaded, send text-only message
            let text = `<b>New Contact Submission (No File)</b>\n\n` +
                      `<b>Name:</b> ${sanitizedName}\n` +
                      `<b>Email:</b> ${sanitizedEmail}`;
            
            if (sanitizedExplanation) {
                text += `\n<b>Message:</b>\n${sanitizedExplanation}`;
            }
            
            const result = await sendTelegramTextMessage(CHAT_ID, text);
            
            if (result.ok) {
                res.json({
                    success: true,
                    message: 'Message sent successfully!'
                });
            } else {
                console.error('Telegram API error:', result);
                res.status(500).json({
                    success: false,
                    message: 'Failed to send message. Please try again.'
                });
            }
        }
    } catch (error) {
        if (filePath) removeFile(filePath);
        
        console.error('Error in /send-file:', error);
        
        // Handle multer errors
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size exceeds 20 MB limit.'
                });
            }
            return res.status(400).json({
                success: false,
                message: `File upload error: ${error.message}`
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message || 'An error occurred while processing your request.'
        });
    }
});

// Global error handler for multer and other errors
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 20 MB limit.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`
        });
    }
    
    if (err.message && err.message.includes('File type not supported')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Static files served from: ${__dirname}`);
});
