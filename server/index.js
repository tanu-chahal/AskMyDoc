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
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

const upload = multer({ storage: storage });
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post('/upload', upload.single('pdf'), (req, res) => {
    console.log("file", req.file)
  res.json({filename: req.file.filename});
});

app.post('/ask', async(req, res) => {
    console.log(req.body)
    const pdfPath = path.resolve(`./uploads/${req.body.filename}`); // Adjust the relative path as necessary
    console.log('PDF Path:', pdfPath);
    const pdfText = await getPdfData(pdfPath); 
    // console.log('PDF Text:', pdfText);
    const ans = await getAnswer(pdfText, req.body.question);
    res.json({answer: ans});
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
