// parse pdf here and upload to supabase
import formidable from "formidable";
import fs from "fs";
import PDFParser from "pdf2json";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parsePdf(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(err.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        let text = "";
        
        // new code: 
        function safeDecode(str) {
            try {
              return decodeURIComponent(str);
            } catch {
              return str;
            }
          }

        // Extract text from pages
        pdfData.Pages.forEach((page) => {
            page.Texts.forEach((textItem) => {
              const raw = textItem.R?.[0]?.T || "";
              text += safeDecode(raw) + " ";
            });
          
            text += "\n";
          });

        resolve(text);
      } catch (e) {
        reject(e);
      }
    });

    pdfParser.loadPDF(filePath);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Form parse error" });
      }

      let file = files.cv;

      if (Array.isArray(file)) file = file[0];

      if (!file?.filepath) {
        return res.status(400).json({ message: "No valid file uploaded" });
      }

      // 🧠 Parse PDF → text
      const text = await parsePdf(file.filepath);
      // limit to prevent abuse
      const MAX_TEXT_LENGTH = 5000;

      if (text.length > MAX_TEXT_LENGTH) {
        return res.status(413).json({
          message: `CV text exceeds limit of ${MAX_TEXT_LENGTH} characters`,
        });
      }

      return res.status(200).json({
        text,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "PDF parsing failed" });
    }
  });
}