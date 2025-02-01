//import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'; // Import the PDF library

import 'pdfjs-dist/legacy/build/pdf.worker.mjs'; // Import the worker script

export async function extractTextFromPDF(url) {
      const loadingTask = await pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      let textContent = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContentPage = await page.getTextContent();
        
        textContentPage.items.forEach(item => {
          textContent += item.str + ' ';
        });
      }

      return textContent.trim();
}