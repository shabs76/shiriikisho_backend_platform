import multer from 'multer';
import fs from 'fs';
import mediaAccessObj from './code/auth/authChecker.js';


// Set up storage for uploaded files
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const directory = './media/images';
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      const originalname = file.originalname;
      const filenameWithoutSpaces = originalname.replace(/\s+/g, '');
      cb(null, Date.now() + '-' + filenameWithoutSpaces);
    }
});

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './media/videos');
    },
    filename: (req, file, cb) => {
      const originalname = file.originalname;
      const filenameWithoutSpaces = originalname.replace(/\s+/g, '');
      cb(null, Date.now() + '-' + filenameWithoutSpaces);
    }
});

const genStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './media/genfiles');
    },
    filename: (req, file, cb) => {
      const originalname = file.originalname;
      const filenameWithoutSpaces = originalname.replace(/\s+/g, '');
      cb(null, Date.now() + '-' + filenameWithoutSpaces);
    }
});

export const imageUpload = multer({ 
  storage: imageStorage,
  fileFilter: async (req, file, cb) => {
    // security check
    // check if proper headers are set
    // const hedz = req.headers;
    // if (typeof (hedz.logkey) !== 'string' || typeof (hedz.logsess) !== 'string' || typeof (hedz.keytype) !== 'string') {
    //   mediaAccessObj.Mlogger.error({state: 'error', data: 'Error missing authorization details'})
    //   cb(new Error('Unauthorized: Missing authorization info.'));
    // }
    cb(null, true); 
    // const ansLog = await mediaAccessObj.uploadImageAuthChecker(hedz.logkey, hedz.logsess, hedz.keytype);
    // mediaAccessObj.Mlogger.debug(ansLog);
    // if (ansLog.state === 'success') {
    //   cb(null, true);
    // } else {
    //   mediaAccessObj.Mlogger.error(ansLog);
    //   cb(new Error('Unauthorized: You are not allowed to upload images.'));
    // }
  }
});
export const videoUpload = multer({ storage: videoStorage });
export const genUpload = multer({ storage: genStorage });
export const mutUsed = multer;


/*



const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();

// Multer configuration for handling image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/media/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    // Implement security checks here (e.g., check user authorization)
    if (/* Add your authorization logic here *) {
      cb(null, true);
    } else {
      cb(new Error('Unauthorized: You are not allowed to upload images.'));
    }
  }
});

// Function to compress images
function compressImage(inputPath, outputPath, quality) {
  ffmpeg(inputPath)
    .outputOptions([`-compression_level ${quality}`, '-f webp'])
    .save(outputPath)
    .on('end', () => {
      console.log(`Image compressed with quality: ${quality} in WebP format`);
    })
    .on('error', (err) => {
      console.error('Error:', err);
    });
}

// Endpoint for uploading images
app.post('/upload/image', imageUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const { path: imagePath, filename } = req.file;
  const lowQualityPath = path.join('/media/images', `output_low_${filename}.webp`);
  const mediumQualityPath = path.join('/media/images', `output_medium_${filename}.webp`);
  const highQualityPath = path.join('/media/images', `output_high_${filename}.webp`);

  // Compress the uploaded image with different qualities
  compressImage(imagePath, lowQualityPath, 30);
  compressImage(imagePath, mediumQualityPath, 60);
  compressImage(imagePath, highQualityPath, 90);

  // Respond with the paths to images
  return res.json({
    original: imagePath,
    lowQuality: lowQualityPath,
    mediumQuality: mediumQualityPath,
    highQuality: highQualityPath
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send('Multer error: ' + err.message);
  } else if (err) {
    return res.status(500).send*/
