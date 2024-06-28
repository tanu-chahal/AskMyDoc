import { PdfReader } from "pdfreader";

export async function getPdfData(pdfPath) {
  return new Promise((resolve, reject) => {
    const data = [];
    new PdfReader().parseFileItems(pdfPath, (err, item) => {
      if (err) {
        console.error("error:", err);
        reject(err);
      } else if (!item) {
        resolve(data.join("")); 
      } else if (item.text) {
        data.push(item.text);
      }
    });
  });
}