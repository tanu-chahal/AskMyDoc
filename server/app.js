import { getPdfData } from './getPdfData.js';
import path from 'path';
import { getAnswer } from './langchain.js';

async function main() {
  try {
    const pdfPath = path.resolve('./MongoDB-Applied-Design-Patterns.pdf'); // Adjust the relative path as necessary
    console.log('PDF Path:', pdfPath);
    const pdfText = await getPdfData(pdfPath); 
    // console.log('PDF Text:', pdfText);
    await getAnswer(pdfText, "What is the book is about?");
  } catch (error) {
    console.error('Error fetching embedding:', error);
  }
}

main();
