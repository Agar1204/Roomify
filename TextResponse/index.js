import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const input = "";

const prompt = "What's the best way to organize a space with one bed, a dresser, two chairs, and a desk?";


// const imagePart = fileToGenerativePart(
//   `${mediaPath}/jetpack.jpg`,
//   "image/jpeg",
// );
// const result = await model.generateContent([prompt, imagePart]);


const result = await model.generateContentStream([prompt]);

// Block over time
for await (const chunk of result.stream){
    const chunkText = chunk.text();
    console.log(chunkText);
}

// Full block @ one time
// console.log(result.response.text());
