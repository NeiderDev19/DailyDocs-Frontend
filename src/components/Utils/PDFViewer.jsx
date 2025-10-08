import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ url }) {
  const [fileData, setFileData] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        setFileData(blob);
      } catch (err) {
        console.error("Error cargando PDF:", err);
      }
    };
    loadFile();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      {fileData ? (
        <Document file={fileData} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      ) : (
        <p>Cargando PDF...</p>
      )}
    </div>
  );
}
