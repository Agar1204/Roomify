import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(filePath, mimeType) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist at the specified path: ${filePath}`);
  }
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
}

const mediaPath = process.env.MEDIA_PATH || './'; // Define base path for media
const inputFileName = "input.jpg"; // Input file name   -> make it 
const inputPath = path.join(mediaPath, inputFileName); // Resolve full file path
const mimeType = "image/jpg"; // Ensure correct MIME type for the file

const prior = ["productivity", "spaciousness", "aesthetics", "storage & organization"];
let i = 0; // change this with a dropdown menu

const prompt = "Give me a list of the large objects in this room and then tell me how I should organize them to prioritize " + prior[i];

try {
  const imagePart = fileToGenerativePart(inputPath, mimeType);
  
  (async () => {
    const result = await model.generateContent([prompt, imagePart]);
    console.log(result.response.text());
  })();
} catch (error) {
  console.error("Error:", error.message);
}
