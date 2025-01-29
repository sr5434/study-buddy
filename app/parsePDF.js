import pdf from "pdf-parse";

export async function extractTextFromPDF(url) {
  const data = await pdf(url);
  const text = data.text;
  return text;
}