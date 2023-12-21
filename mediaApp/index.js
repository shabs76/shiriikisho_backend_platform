import cors from 'cors';
import express from 'express';
import Ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
// internal modules
import mediaStorageObj from './code/manager/processes/mediaStorageProcesses.js';
import mediaAccessObj from './code/auth/authChecker.js';
// multer
import { imageUpload, videoUpload, genUpload, mutUsed } from './multerConfigs.js';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const compressImage = (inputPath, outputPath, quality) => {
  Ffmpeg(inputPath)
    .outputOptions([`-compression_level ${quality}`, '-f webp'])
    .save(outputPath)
    .on('end', () => {
      console.log(`Image compressed with quality: ${quality} in WebP format`);
    })
    .on('error', (err) => {
      console.error('Error:', err);
    });
}

const compressVideo = (inputPath, outputPath, quality) => {
  Ffmpeg(inputPath)
    .outputOptions([`-crf ${quality}`, '-f webm'])
    .save(outputPath)
    .on('end', () => {
      console.log(`Video compressed with quality: ${quality} in WebM format`);
    })
    .on('error', (err) => {
      console.error('Error:', err);
    });
}

app.post('/upload/images', imageUpload.single('image'), async (req, res) => {
  mediaStorageObj.Mlogger.debug('here');
  if (!req.file) {
    const er = {
      state: 'error',
      data: 'No image file was uploaded'
    }
    return res.json(er);
  }
  const datz = req.body;
  if (typeof (datz.purpose) !== 'string') {
    const er = {
      state: 'error',
      data: 'Missing image purpose. Please insert it and try again'
    }
    return res.json(er);
  }

  const { path: imagePath, filename } = req.file;
  const lowQualityPath = path.join('./media/images', `${filename}_low_image.webp`);
  const mediumQualityPath = path.join('./media/images', `${filename}_medium_image.webp`);
  const highQualityPath = path.join('./media/images', `${filename}_high_image.webp`);

  // Compress the uploaded image with different qualities
  compressImage(imagePath, lowQualityPath, 30);
  compressImage(imagePath, mediumQualityPath, 60);
  compressImage(imagePath, highQualityPath, 90);

  const saveDat = {
    o_path: imagePath,
    l_path: lowQualityPath,
    m_path: mediumQualityPath,
    h_path: highQualityPath,
    purpose: datz.purpose,
  }

  const ansData = await mediaStorageObj.saveUploadedImageDetails(saveDat); // remember to implement object delete on error here

  // Respond with the paths to images
  return res.json(ansData);
});

const authcheckForAcces = async (req, res, next) => {
  const hedz = req.headers;
  console.log(hedz);
  if (typeof (hedz.logkey) !== 'string' || typeof (hedz.logsess) !== 'string' || typeof (hedz.keytype) !== 'string') {
      return res.status(403).send('Forbidden');
  }
  const authAns = await mediaAccessObj.getImageFilesAuthChecker(hedz.logkey, hedz.logsess, hedz.keytype);
  if (authAns.state !== 'success') {
    mediaAccessObj.Mlogger.error(authAns);
    return res.status(403).send('Forbidden');
  }
  next();
}

app.get('/get/image/:image', authcheckForAcces, async (req, res) => {
    const { image } = req.params;
    const imageD = await mediaStorageObj.getAllImagesPathsNormal(image);
    if (imageD.state !== 'success') {
        return res.status(404).send('File record not found');
    }
    const fileName = imageD.data.image_path_qm;
    fs.access('/usr/src/app/'+fileName, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).send('File not found');
      } else {
        // Serve the file if it exists and the user is authorized
        res.sendFile('/usr/src/app/'+fileName);
      }
    });
});

app.use((err, req, res, next) => {
  if (err instanceof mutUsed.MulterError) {
    const er = {
      state: 'error',
      data: 'Media service error has occurred'
    }
    mediaStorageObj.Mlogger.error('Multer error: ' + err.message);
    return res.json(er);
  } else if (err) {
    mediaStorageObj.Mlogger.error(err);
    const er = {
      state: 'error',
      data: 'System error has occurred'
    }
    return res.json(er)
  }
  next();
})

app.get('/', (req, res) => {
  res.json('Hello World media here');
});

app.listen(5600, () =>
  console.log(`Media app is listening on port 5600!`),
);