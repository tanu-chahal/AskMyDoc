// import express from 'express';
// import multer from 'multer';
// import dotenv from "dotenv";
// import fs from 'fs';
// import cors from 'cors'; 
// import { getPdfData } from './getPdfData.js';
// import path from 'path';
// import { getAnswer } from './langchain.js';
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders: 'Content-Type, Authorization'
//   }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); 
//   },
//   filename: (req, file, cb) => {
//     // cb(null, `${Date.now()}-${file.originalname}`); 
//     cb(null, `${file.originalname}`); 
//   }
// });

// const upload = multer({ storage: storage });
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// app.post('/upload', upload.single('pdf'), (req, res) => {
//   console.log("file", req.file)
//   res.json({filename: req.file.filename});
// });

// app.post('/ask', async(req, res) => {
//     console.log(req.body)
//     const pdfPath = path.resolve(`./uploads/${req.body.filename}`); 
//     console.log('PDF Path:', pdfPath);
//     const pdfText = await getPdfData(pdfPath); 
//     // console.log('PDF Text:', pdfText);
//     const ans = await getAnswer(pdfText, req.body.question);
//     res.json({answer: ans});
//   });
  

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import express from 'express';
import multer from 'multer';
import dotenv from "dotenv";
import fs from 'fs';
import cors from 'cors'; 
import { getPdfData } from './getPdfData.js';
import path from 'path';
import { getAnswer } from './langchain.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // cb(null,`${Date.now()}-${file.originalname}`);
    cb(null,file.originalname);
  }
});

const upload = multer({
  storage: storage,
  // fileFilter: (req, file, cb) => {
  //   console.log(file)
  //   if (file.mimetype !== 'application/pdf') {
  //     return cb(new Error('Only PDF files are allowed'), false);
  //   }
  //   cb(null, true);
  // },
  // limits: {
  //   fileSize: 1048576 
  // }
});

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
  }
  console.log(req.file.filename);
  res.json({ filename: req.file.filename });
});

app.post('/ask', async (req, res, next) => {
  try {
    const pdfPath = path.resolve(`./uploads/${req.body.filename}`);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'File not found.' });
    }
    const pdfText = await getPdfData(pdfPath);
    const ans = await getAnswer(pdfText, req.body.question);
    res.json({ answer: ans });
  } catch (error) {
    next(error);
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
