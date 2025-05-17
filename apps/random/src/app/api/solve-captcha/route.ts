import { EasyOCR } from "node-easyocr";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const base64 = await request.text();
  const ocr = new EasyOCR();
  await ocr.init(["en"]);
  const result = await ocr.readText(path.join(__dirname, "captcha.jpeg"));
  await ocr.close();
  console.log("OCR Result:", __dirname);
  return Response.json({ result }); // TODO: return the result
}
